import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';
import { RestaurantDto } from './dto/restaurant.dto';

const STUB_RESTAURANTS: RestaurantDto[] = [
  { id: '1', name: 'Biryani House', cuisine: 'North Indian', rating: 4.2, address: 'Koramangala' },
  { id: '2', name: 'Spice Garden', cuisine: 'Multi-cuisine', rating: 4.0, address: 'Indiranagar' },
  { id: '3', name: 'Tasty Bites', cuisine: 'South Indian', rating: 4.5, address: 'HSR Layout' },
  { id: '4', name: 'Pizza Paradise', cuisine: 'Italian', rating: 4.3, address: 'Jayanagar' },
];

@ApiTags('Restaurants')
@Controller('restaurants')
@Public()
export class RestaurantsController {
  @Get()
  @ApiOperation({
    summary: 'List restaurants',
    description:
      'Returns a list of restaurants. Supports optional query params for cuisine, search, and location (to be extended).',
  })
  @ApiResponse({ status: 200, description: 'List of restaurants', type: [RestaurantDto] })
  list(): RestaurantDto[] {
    return STUB_RESTAURANTS;
  }
}
