import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService],
    }).compile();
    service = module.get<SearchService>(SearchService);
  });

  it('indexRestaurant and searchRestaurants by name', async () => {
    await service.indexRestaurant({
      id: 'rest-1',
      name: 'Biryani House',
      type: 'North Indian',
      address: 'Koramangala',
    });
    const list = await service.searchRestaurants({ query: 'biryani' });
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Biryani House');
  });

  it('searchRestaurants filter by type', async () => {
    await service.indexRestaurant({ id: 'r1', name: 'R1', type: 'North Indian' });
    await service.indexRestaurant({ id: 'r2', name: 'R2', type: 'South Indian' });
    const list = await service.searchRestaurants({ type: 'North Indian' });
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('r1');
  });

  it('indexDish and searchDishes with price filter', async () => {
    await service.indexDish({
      id: 'd1',
      restaurantId: 'r1',
      name: 'Biryani',
      type: 'Main',
      priceCents: 25000,
      available: true,
    });
    await service.indexDish({
      id: 'd2',
      restaurantId: 'r1',
      name: 'Curry',
      type: 'Main',
      priceCents: 15000,
      available: true,
    });
    const list = await service.searchDishes({ minPrice: 20000, maxPrice: 30000 });
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Biryani');
  });

  it('deleteRestaurant removes restaurant and its dishes', async () => {
    await service.indexRestaurant({ id: 'r1', name: 'R1', type: 'T' });
    await service.indexDish({
      id: 'd1',
      restaurantId: 'r1',
      name: 'D1',
      type: 'T',
      priceCents: 100,
      available: true,
    });
    await service.deleteRestaurant('r1');
    expect(await service.searchRestaurants({})).toHaveLength(0);
    expect(await service.searchDishes({})).toHaveLength(0);
  });
});
