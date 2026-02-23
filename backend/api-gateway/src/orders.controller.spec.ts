import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
    }).compile();
    controller = app.get<OrdersController>(OrdersController);
  });

  it('GET /orders returns list with id, restaurantName, status, total', () => {
    const result = controller.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    const first = result[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('restaurantName');
    expect(first).toHaveProperty('status');
    expect(first).toHaveProperty('total');
    expect(first).toHaveProperty('createdAt');
  });
});
