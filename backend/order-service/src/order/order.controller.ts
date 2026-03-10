import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  AddToCartDto,
  CheckoutDto,
  OrderStatus,
  PaymentInitiateDto,
  UpdateCartItemDto,
} from './dto/order.dto';
import { OrderService } from './order.service';

const X_USER_ID = 'x-user-id';

function uid(header?: string): string {
  return header && header.trim() ? header.trim() : 'anonymous';
}

@Controller('cart')
export class CartController {
  constructor(private readonly order: OrderService) {}

  @Get()
  get(@Headers(X_USER_ID) xUserId?: string) {
    return this.order.getCartDto(uid(xUserId));
  }

  @Post('items')
  add(@Headers(X_USER_ID) xUserId: string | undefined, @Body() dto: AddToCartDto) {
    return this.order.addToCart(uid(xUserId), dto);
  }

  @Patch('items/:restaurantId/:menuItemId')
  update(
    @Headers(X_USER_ID) xUserId: string | undefined,
    @Param('restaurantId') restaurantId: string,
    @Param('menuItemId') menuItemId: string,
    @Body() dto: UpdateCartItemDto
  ) {
    return this.order.updateCartItem(uid(xUserId), menuItemId, restaurantId, dto);
  }

  @Patch('address')
  setAddress(@Headers(X_USER_ID) xUserId: string | undefined, @Body() body: { addressId: string }) {
    return this.order.setCartAddress(uid(xUserId), body.addressId);
  }
}

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly order: OrderService) {}

  @Post()
  checkout(@Headers(X_USER_ID) xUserId: string | undefined, @Body() dto: CheckoutDto) {
    return this.order.checkout(uid(xUserId), dto);
  }
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly order: OrderService) {}

  @Get()
  list(@Headers(X_USER_ID) xUserId?: string) {
    return this.order.listOrders(uid(xUserId));
  }

  @Get(':id')
  get(@Headers(X_USER_ID) xUserId: string | undefined, @Param('id') id: string) {
    const o = this.order.getOrder(uid(xUserId), id);
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  @Post(':id/cancel')
  cancel(@Headers(X_USER_ID) xUserId: string | undefined, @Param('id') id: string) {
    return this.order.cancelOrder(uid(xUserId), id);
  }
}

const ORDER_STATUSES: OrderStatus[] = ['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

@Controller('restaurant-orders')
export class RestaurantOrdersController {
  constructor(private readonly order: OrderService) {}

  @Get(':restaurantId')
  list(@Param('restaurantId') restaurantId: string) {
    return this.order.listOrdersByRestaurant(restaurantId);
  }

  @Get(':restaurantId/orders/:orderId')
  get(
    @Param('restaurantId') restaurantId: string,
    @Param('orderId') orderId: string
  ) {
    const o = this.order.getOrderByRestaurant(restaurantId, orderId);
    if (!o) throw new NotFoundException('Order not found');
    return o;
  }

  @Patch(':restaurantId/orders/:orderId/status')
  updateStatus(
    @Param('restaurantId') restaurantId: string,
    @Param('orderId') orderId: string,
    @Body() body: { status: string; note?: string }
  ) {
    const o = this.order.getOrderByRestaurant(restaurantId, orderId);
    if (!o) throw new NotFoundException('Order not found');
    if (!ORDER_STATUSES.includes(body.status as (typeof ORDER_STATUSES)[number])) {
      throw new BadRequestException('Invalid status');
    }
    return this.order.updateOrderStatus(orderId, body.status as OrderStatus, body.note);
  }

  @Patch(':restaurantId/orders/:orderId/customer')
  setCustomer(
    @Param('restaurantId') restaurantId: string,
    @Param('orderId') orderId: string,
    @Body() body: { customerName: string; customerPhone: string }
  ) {
    const o = this.order.getOrderByRestaurant(restaurantId, orderId);
    if (!o) throw new NotFoundException('Order not found');
    return this.order.setOrderCustomer(orderId, body.customerName, body.customerPhone);
  }

  @Patch(':restaurantId/orders/:orderId/eta')
  setEta(
    @Param('restaurantId') restaurantId: string,
    @Param('orderId') orderId: string,
    @Body() body: { eta: string }
  ) {
    const o = this.order.getOrderByRestaurant(restaurantId, orderId);
    if (!o) throw new NotFoundException('Order not found');
    return this.order.setOrderEta(orderId, body.eta);
  }
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly order: OrderService) {}

  @Post('initiate')
  initiate(@Body() dto: PaymentInitiateDto) {
    return this.order.initiatePayment(dto.orderId, dto.amountCents);
  }

  @Get(':paymentId/status')
  status(@Param('paymentId') paymentId: string) {
    const s = this.order.getPaymentStatus(paymentId);
    if (!s) throw new NotFoundException('Payment not found');
    return s;
  }
}
