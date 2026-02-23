import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import type {
  DishDoc,
  RestaurantDoc,
  SearchDishesQuery,
  SearchRestaurantsQuery,
} from './search.service';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Post('index/restaurants')
  indexRestaurant(@Body() doc: RestaurantDoc) {
    return this.search.indexRestaurant(doc);
  }

  @Post('index/dishes')
  indexDish(@Body() doc: DishDoc) {
    return this.search.indexDish(doc);
  }

  @Delete('index/restaurants/:id')
  deleteRestaurant(@Param('id') id: string) {
    return this.search.deleteRestaurant(id);
  }

  @Delete('index/dishes/:id')
  deleteDish(@Param('id') id: string) {
    return this.search.deleteDish(id);
  }

  @Get('restaurants')
  searchRestaurants(@Query('q') q?: string, @Query('type') type?: string) {
    const query: SearchRestaurantsQuery = { query: q, type };
    return this.search.searchRestaurants(query);
  }

  @Get('dishes')
  searchDishes(
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('available') available?: string
  ) {
    const query: SearchDishesQuery = {
      query: q,
      type,
      minPrice: minPrice != null ? Number(minPrice) : undefined,
      maxPrice: maxPrice != null ? Number(maxPrice) : undefined,
      available: available === 'true' ? true : available === 'false' ? false : undefined,
    };
    return this.search.searchDishes(query);
  }
}
