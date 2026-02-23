import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type {
  AddToCartDto,
  CartDto,
  CheckoutDto,
  OrderDto,
  OrderStatus,
  UpdateCartItemDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  private carts = new Map<
    string,
    { items: Map<string, AddToCartDto & { key: string }>; selectedAddressId: string | null }
  >();
  private orders = new Map<string, OrderDto>();
  private payments = new Map<
    string,
    { orderId: string; status: 'pending' | 'completed' | 'failed' }
  >();
  private nextOrderId = 1;
  private nextPaymentId = 1;

  private getCart(userId: string): {
    items: Map<string, AddToCartDto & { key: string }>;
    selectedAddressId: string | null;
  } {
    let c = this.carts.get(userId);
    if (!c) {
      c = { items: new Map(), selectedAddressId: null };
      this.carts.set(userId, c);
    }
    return c;
  }

  getCartDto(userId: string): CartDto {
    const c = this.getCart(userId);
    const items = Array.from(c.items.values()).map((i) => ({
      menuItemId: i.menuItemId,
      restaurantId: i.restaurantId,
      name: i.name,
      quantity: i.quantity,
      priceCents: i.priceCents,
    }));
    const totalCents = items.reduce((s, i) => s + i.quantity * i.priceCents, 0);
    return { userId, items, selectedAddressId: c.selectedAddressId, totalCents };
  }

  addToCart(userId: string, dto: AddToCartDto): CartDto {
    const c = this.getCart(userId);
    const key = `${dto.restaurantId}:${dto.menuItemId}`;
    const existing = c.items.get(key);
    if (existing) {
      existing.quantity += dto.quantity;
    } else {
      c.items.set(key, { ...dto, key });
    }
    return this.getCartDto(userId);
  }

  updateCartItem(
    userId: string,
    menuItemId: string,
    restaurantId: string,
    dto: UpdateCartItemDto
  ): CartDto {
    const c = this.getCart(userId);
    const key = `${restaurantId}:${menuItemId}`;
    const item = c.items.get(key);
    if (!item) throw new NotFoundException('Cart item not found');
    if (dto.quantity === 0) {
      c.items.delete(key);
    } else {
      item.quantity = dto.quantity;
    }
    return this.getCartDto(userId);
  }

  setCartAddress(userId: string, addressId: string): CartDto {
    const c = this.getCart(userId);
    c.selectedAddressId = addressId;
    return this.getCartDto(userId);
  }

  checkout(userId: string, dto: CheckoutDto): OrderDto {
    const cart = this.getCartDto(userId);
    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');
    if (cart.selectedAddressId !== dto.selectedAddressId) {
      const c = this.getCart(userId);
      c.selectedAddressId = dto.selectedAddressId;
    }
    const restaurantId = cart.items[0].restaurantId;
    const restaurantName = `Restaurant ${restaurantId}`;
    const totalCents = cart.totalCents;
    const id = `ord-${this.nextOrderId++}`;
    const now = new Date().toISOString();
    const order: OrderDto = {
      id,
      userId,
      restaurantId,
      restaurantName,
      status: 'placed',
      items: [...cart.items],
      totalCents,
      addressId: dto.selectedAddressId,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(id, order);
    this.carts.set(userId, { items: new Map(), selectedAddressId: null });
    return { ...order };
  }

  listOrders(userId: string): OrderDto[] {
    return Array.from(this.orders.values()).filter((o) => o.userId === userId);
  }

  getOrder(userId: string, orderId: string): OrderDto | null {
    const o = this.orders.get(orderId);
    return o && o.userId === userId ? o : null;
  }

  getOrderOrThrow(userId: string, orderId: string): OrderDto {
    const o = this.getOrder(userId, orderId);
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): OrderDto {
    const o = this.orders.get(orderId);
    if (!o) throw new NotFoundException('Order not found');
    o.status = status;
    o.updatedAt = new Date().toISOString();
    return { ...o };
  }

  cancelOrder(userId: string, orderId: string): OrderDto {
    const o = this.getOrderOrThrow(userId, orderId);
    if (o.status !== 'placed') throw new BadRequestException('Only placed orders can be cancelled');
    o.status = 'cancelled';
    o.updatedAt = new Date().toISOString();
    return { ...o };
  }

  initiatePayment(orderId: string, _amountCents: number): { paymentId: string; status: string } {
    const o = this.orders.get(orderId);
    if (!o) throw new NotFoundException('Order not found');
    const paymentId = `pay-${this.nextPaymentId++}`;
    this.payments.set(paymentId, { orderId, status: 'pending' });
    o.paymentId = paymentId;
    return { paymentId, status: 'pending' };
  }

  getPaymentStatus(
    paymentId: string
  ): { paymentId: string; status: string; orderId: string } | null {
    const p = this.payments.get(paymentId);
    if (!p) return null;
    return { paymentId, status: p.status, orderId: p.orderId };
  }

  setPaymentCompleted(paymentId: string): void {
    const p = this.payments.get(paymentId);
    if (p) p.status = 'completed';
  }
}
