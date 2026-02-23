import { Test, TestingModule } from '@nestjs/testing';
import { PreferenceService } from './preference.service';

describe('PreferenceService', () => {
  let service: PreferenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreferenceService],
    }).compile();
    service = module.get<PreferenceService>(PreferenceService);
  });

  it('getUserContext returns empty preferences for new user', async () => {
    const ctx = await service.getUserContext('user-1');
    expect(ctx.userId).toBe('user-1');
    expect(ctx.preferences).toEqual([]);
  });

  it('recordPreference adds and getUserContext returns tree data', async () => {
    await service.recordPreference({
      userId: 'user-1',
      dayOfWeek: 1,
      hourOfDay: 12,
      category: 'North Indian',
      subcategory: 'Biryani',
      restaurantId: 'r1',
      dishId: 'd1',
      weightDelta: 1,
    });
    const ctx = await service.getUserContext('user-1');
    expect(ctx.preferences).toHaveLength(1);
    expect(ctx.preferences[0].category).toBe('North Indian');
    expect(ctx.preferences[0].weight).toBe(1);
  });

  it('recordPreference increments weight for same node', async () => {
    await service.recordPreference({
      userId: 'u1',
      dayOfWeek: 0,
      category: 'Fast Food',
      weightDelta: 1,
    });
    await service.recordPreference({
      userId: 'u1',
      dayOfWeek: 0,
      category: 'Fast Food',
      weightDelta: 2,
    });
    const ctx = await service.getUserContext('u1');
    expect(ctx.preferences).toHaveLength(1);
    expect(ctx.preferences[0].weight).toBe(3);
  });

  it('setSession and getSession round-trip', async () => {
    await service.setSession('u1', { cartId: 'c1', page: 'search' });
    const session = await service.getSession('u1');
    expect(session.cartId).toBe('c1');
    expect(session.page).toBe('search');
    expect(session.lastActiveAt).toBeDefined();
  });
});
