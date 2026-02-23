import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';
import { OrderDto } from './dto/restaurant.dto';

const STUB_ORDERS: OrderDto[] = [
  {
    id: 'ord-1',
    restaurantName: 'Biryani House',
    status: 'out_for_delivery',
    total: 450,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ord-2',
    restaurantName: 'Spice Garden',
    status: 'delivered',
    total: 320,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

@ApiTags('Orders')
@Controller('orders')
@Public()
export class OrdersController {
  @Get()
  @ApiOperation({
    summary: 'List orders',
    description:
      'Returns orders for the current user (customer) or restaurant. Auth and filters to be added.',
  })
  @ApiResponse({ status: 200, description: 'List of orders', type: [OrderDto] })
  list(): OrderDto[] {
    return STUB_ORDERS;
  }
}
