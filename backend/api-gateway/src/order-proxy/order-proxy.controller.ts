import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { OrderProxyService } from './order-proxy.service';

@ApiTags('Order proxy')
@Controller('order-proxy')
@Public()
export class OrderProxyController {
  constructor(private readonly proxy: OrderProxyService) {}

  private userId(@Req() req: { headers: { authorization?: string } }) {
    return this.proxy.getUserId(req.headers.authorization);
  }

  @Get('cart')
  getCart(@Req() req: { headers: { authorization?: string } }) {
    return this.proxy.getCart(this.userId(req));
  }

  @Post('cart/items')
  addToCart(
    @Req() req: { headers: { authorization?: string } },
    @Body()
    dto: {
      menuItemId: string;
      restaurantId: string;
      name: string;
      quantity: number;
      priceCents: number;
    }
  ) {
    return this.proxy.addToCart(this.userId(req), dto);
  }

  @Patch('cart/address')
  setCartAddress(
    @Req() req: { headers: { authorization?: string } },
    @Body() body: { addressId: string }
  ) {
    return this.proxy.setCartAddress(this.userId(req), body.addressId);
  }

  @Post('checkout')
  checkout(
    @Req() req: { headers: { authorization?: string } },
    @Body() dto: { selectedAddressId: string }
  ) {
    return this.proxy.checkout(this.userId(req), dto);
  }

  @Get('orders')
  listOrders(@Req() req: { headers: { authorization?: string } }) {
    return this.proxy.listOrders(this.userId(req));
  }

  @Get('orders/:id')
  getOrder(@Req() req: { headers: { authorization?: string } }, @Param('id') id: string) {
    return this.proxy.getOrder(this.userId(req), id);
  }

  @Post('orders/:id/cancel')
  cancelOrder(@Req() req: { headers: { authorization?: string } }, @Param('id') id: string) {
    return this.proxy.cancelOrder(this.userId(req), id);
  }
}
