import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsController } from './restaurants.controller';

describe('RestaurantsController', () => {
  let controller: RestaurantsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantsController],
    }).compile();
    controller = app.get<RestaurantsController>(RestaurantsController);
  });

  it('GET /restaurants returns list with id, name, cuisine, rating', () => {
    const result = controller.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    const first = result[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('cuisine');
    expect(first).toHaveProperty('rating');
    expect(first).toHaveProperty('address');
  });
});
