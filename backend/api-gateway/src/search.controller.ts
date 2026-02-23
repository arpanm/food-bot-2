import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';

const STUB_RESTAURANTS = [
  { id: '1', name: 'Biryani House', type: 'North Indian', address: 'Koramangala', rating: 4.2 },
  { id: '2', name: 'Spice Garden', type: 'Multi-cuisine', address: 'Indiranagar', rating: 4.0 },
  { id: '3', name: 'Tasty Bites', type: 'South Indian', address: 'HSR Layout', rating: 4.5 },
  { id: '4', name: 'Pizza Paradise', type: 'Italian', address: 'Jayanagar', rating: 4.3 },
];

const STUB_DISHES = [
  {
    id: 'd1',
    restaurantId: '1',
    name: 'Chicken Biryani',
    type: 'Main',
    priceCents: 25000,
    available: true,
  },
  {
    id: 'd2',
    restaurantId: '1',
    name: 'Veg Biryani',
    type: 'Main',
    priceCents: 18000,
    available: true,
  },
  {
    id: 'd3',
    restaurantId: '2',
    name: 'Butter Naan',
    type: 'Bread',
    priceCents: 6000,
    available: true,
  },
  {
    id: 'd4',
    restaurantId: '3',
    name: 'Masala Dosa',
    type: 'Main',
    priceCents: 8900,
    available: true,
  },
];

@ApiTags('Search')
@Controller('search')
@Public()
export class SearchController {
  @Get('restaurants')
  @ApiOperation({ summary: 'Search restaurants by query and type' })
  @ApiResponse({ status: 200, description: 'List of restaurants' })
  searchRestaurants(@Query('q') q?: string, @Query('type') type?: string) {
    let list = [...STUB_RESTAURANTS];
    if (q?.trim()) {
      const lower = q.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) || (r.type && r.type.toLowerCase().includes(lower))
      );
    }
    if (type?.trim()) {
      const t = type.trim().toLowerCase();
      list = list.filter((r) => r.type && r.type.toLowerCase() === t);
    }
    return list;
  }

  @Get('dishes')
  @ApiOperation({ summary: 'Search dishes by query and type' })
  @ApiResponse({ status: 200, description: 'List of dishes' })
  searchDishes(@Query('q') q?: string, @Query('type') type?: string) {
    let list = [...STUB_DISHES];
    if (q?.trim()) {
      const lower = q.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(lower) || (d.type && d.type.toLowerCase().includes(lower))
      );
    }
    if (type?.trim()) {
      const t = type.trim().toLowerCase();
      list = list.filter((d) => d.type && d.type.toLowerCase() === t);
    }
    return list;
  }
}
