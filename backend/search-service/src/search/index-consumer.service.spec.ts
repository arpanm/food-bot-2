import { Test, TestingModule } from '@nestjs/testing';
import { IndexConsumerService } from './index-consumer.service';
import { SearchService } from './search.service';

describe('IndexConsumerService', () => {
  let consumer: IndexConsumerService;
  let search: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchService, IndexConsumerService],
    }).compile();
    consumer = module.get<IndexConsumerService>(IndexConsumerService);
    search = module.get<SearchService>(SearchService);
  });

  it('handleRestaurantEvent indexes on created', async () => {
    await consumer.handleRestaurantEvent({
      type: 'restaurant.created',
      payload: { id: 'r1', name: 'Biryani House', type: 'North Indian' },
    });
    const list = await search.searchRestaurants({ query: 'biryani' });
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('r1');
  });

  it('handleRestaurantEvent deletes on deleted', async () => {
    await consumer.handleRestaurantEvent({
      type: 'restaurant.created',
      payload: { id: 'r1', name: 'R1', type: 'T' },
    });
    await consumer.handleRestaurantEvent({ type: 'restaurant.deleted', payload: { id: 'r1' } });
    expect(await search.searchRestaurants({})).toHaveLength(0);
  });

  it('handleMenuEvent indexes on created', async () => {
    await consumer.handleMenuEvent({
      type: 'dish.created',
      payload: {
        id: 'd1',
        restaurantId: 'r1',
        name: 'Biryani',
        type: 'Main',
        priceCents: 25000,
        available: true,
      },
    });
    const list = await search.searchDishes({ query: 'biryani' });
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe('d1');
  });

  it('handleMenuEvent is idempotent on update', async () => {
    await consumer.handleMenuEvent({
      type: 'dish.created',
      payload: {
        id: 'd1',
        restaurantId: 'r1',
        name: 'Curry',
        type: 'Main',
        priceCents: 15000,
        available: true,
      },
    });
    await consumer.handleMenuEvent({
      type: 'dish.updated',
      payload: {
        id: 'd1',
        restaurantId: 'r1',
        name: 'Curry Updated',
        type: 'Main',
        priceCents: 18000,
        available: false,
      },
    });
    const list = await search.searchDishes({});
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Curry Updated');
    expect(list[0].priceCents).toBe(18000);
    expect(list[0].available).toBe(false);
  });
});
