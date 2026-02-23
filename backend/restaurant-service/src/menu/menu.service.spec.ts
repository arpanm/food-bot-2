import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingService } from '../onboarding/onboarding.service';
import { OnboardingModule } from '../onboarding/onboarding.module';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let menuService: MenuService;
  let restId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OnboardingModule],
      providers: [MenuService],
    }).compile();
    menuService = module.get<MenuService>(MenuService);
    const onboarding = module.get<OnboardingService>(OnboardingService);
    const r = onboarding.create({
      name: 'R',
      contactEmail: 'e@e.com',
      contactPhone: '1',
      restaurantType: 'T',
      address: 'A',
    });
    restId = r.id;
  });

  it('list returns empty initially', () => {
    expect(menuService.list(restId)).toEqual([]);
  });

  it('create adds item and list returns it', () => {
    const item = menuService.create(restId, {
      name: 'Biryani',
      category: 'Main',
      priceCents: 25000,
    });
    expect(item.id).toBeDefined();
    expect(item.name).toBe('Biryani');
    expect(item.available).toBe(true);
    expect(menuService.list(restId)).toHaveLength(1);
  });

  it('update modifies item', () => {
    const item = menuService.create(restId, { name: 'Curry', category: 'Main', priceCents: 20000 });
    const updated = menuService.update(restId, item.id!, { priceCents: 22000, available: false });
    expect(updated.priceCents).toBe(22000);
    expect(updated.available).toBe(false);
  });

  it('delete removes item', () => {
    const item = menuService.create(restId, { name: 'X', category: 'Y', priceCents: 100 });
    menuService.delete(restId, item.id!);
    expect(menuService.list(restId)).toHaveLength(0);
    expect(menuService.get(restId, item.id!)).toBeNull();
  });

  it('get throws when restaurant not found', () => {
    expect(() => menuService.list('rest-999')).toThrow(NotFoundException);
  });
});
