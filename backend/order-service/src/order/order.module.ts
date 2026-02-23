import { Module } from '@nestjs/common';
import {
  CartController,
  CheckoutController,
  OrdersController,
  PaymentController,
} from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [CartController, CheckoutController, OrdersController, PaymentController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
