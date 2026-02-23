import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  const userId = 'user-1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
    }).compile();
    service = module.get<OrderService>(OrderService);
  });

  it('getCartDto returns empty cart', () => {
    const cart = service.getCartDto(userId);
    expect(cart.items).toEqual([]);
    expect(cart.totalCents).toBe(0);
    expect(cart.selectedAddressId).toBeNull();
  });

  it('addToCart adds item and total updates', () => {
    service.addToCart(userId, {
      menuItemId: 'item-1',
      restaurantId: 'rest-1',
      name: 'Biryani',
      quantity: 2,
      priceCents: 25000,
    });
    const cart = service.getCartDto(userId);
    expect(cart.items).toHaveLength(1);
    expect(cart.totalCents).toBe(50000);
  });

  it('checkout creates order and clears cart', () => {
    service.addToCart(userId, {
      menuItemId: 'item-1',
      restaurantId: 'rest-1',
      name: 'Biryani',
      quantity: 1,
      priceCents: 25000,
    });
    service.setCartAddress(userId, 'addr-1');
    const order = service.checkout(userId, { selectedAddressId: 'addr-1' });
    expect(order.id).toBeDefined();
    expect(order.status).toBe('placed');
    expect(order.totalCents).toBe(25000);
    const cart = service.getCartDto(userId);
    expect(cart.items).toHaveLength(0);
  });

  it('checkout throws when cart empty', () => {
    expect(() => service.checkout(userId, { selectedAddressId: 'addr-1' })).toThrow(
      BadRequestException
    );
  });

  it('listOrders returns orders for user', () => {
    service.addToCart(userId, {
      menuItemId: 'i',
      restaurantId: 'r',
      name: 'N',
      quantity: 1,
      priceCents: 100,
    });
    service.setCartAddress(userId, 'a');
    const order = service.checkout(userId, { selectedAddressId: 'a' });
    const list = service.listOrders(userId);
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(order.id);
  });

  it('cancelOrder cancels placed order', () => {
    service.addToCart(userId, {
      menuItemId: 'i',
      restaurantId: 'r',
      name: 'N',
      quantity: 1,
      priceCents: 100,
    });
    service.setCartAddress(userId, 'a');
    const order = service.checkout(userId, { selectedAddressId: 'a' });
    const cancelled = service.cancelOrder(userId, order.id);
    expect(cancelled.status).toBe('cancelled');
  });

  it('initiatePayment returns paymentId', () => {
    service.addToCart(userId, {
      menuItemId: 'i',
      restaurantId: 'r',
      name: 'N',
      quantity: 1,
      priceCents: 100,
    });
    service.setCartAddress(userId, 'a');
    const order = service.checkout(userId, { selectedAddressId: 'a' });
    const pay = service.initiatePayment(order.id, order.totalCents);
    expect(pay.paymentId).toBeDefined();
    expect(pay.status).toBe('pending');
    const status = service.getPaymentStatus(pay.paymentId);
    expect(status?.orderId).toBe(order.id);
  });
});
