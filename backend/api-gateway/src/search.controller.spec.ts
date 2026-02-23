import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
    }).compile();
    controller = module.get<SearchController>(SearchController);
  });

  it('searchRestaurants returns list', () => {
    const list = controller.searchRestaurants();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('name');
  });

  it('searchRestaurants filters by q', () => {
    const list = controller.searchRestaurants('biryani');
    expect(list.some((r) => r.name.toLowerCase().includes('biryani'))).toBe(true);
  });

  it('searchDishes returns list', () => {
    const list = controller.searchDishes();
    expect(Array.isArray(list)).toBe(true);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('priceCents');
  });
});
