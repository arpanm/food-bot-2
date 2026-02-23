import { ApiProperty } from '@nestjs/swagger';

export class RestaurantDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  cuisine!: string;

  @ApiProperty()
  rating!: number;

  @ApiProperty({ required: false })
  address?: string;
}

export class OrderDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  restaurantName!: string;

  @ApiProperty({ enum: ['placed', 'preparing', 'out_for_delivery', 'delivered'] })
  status!: string;

  @ApiProperty()
  total!: number;

  @ApiProperty()
  createdAt!: string;
}
