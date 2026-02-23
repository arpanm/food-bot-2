import { Test, TestingModule } from '@nestjs/testing';
import { IntentService } from './intent.service';
import { VectorCacheService } from './vector-cache.service';

describe('IntentService', () => {
  let service: IntentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntentService, VectorCacheService],
    }).compile();
    service = module.get<IntentService>(IntentService);
  });

  it('getIntentAndWorkflow returns intent and workflow for order prompt', async () => {
    const result = await service.getIntentAndWorkflow({ prompt: 'I want to order biryani' });
    expect(result.intent).toBeDefined();
    expect(result.workflow.steps.length).toBeGreaterThan(0);
    expect(result.intent).toBe('order_food');
  });

  it('getIntentAndWorkflow returns party_planner for party prompt', async () => {
    const result = await service.getIntentAndWorkflow({ prompt: 'plan a party for 20 people' });
    expect(result.intent).toBe('party_planner');
  });

  it('getIntentAndWorkflow returns diet_planner for diet prompt', async () => {
    const result = await service.getIntentAndWorkflow({ prompt: 'weekly diet plan' });
    expect(result.intent).toBe('diet_planner');
  });

  it('cache is used on second call for same prompt', async () => {
    const r1 = await service.getIntentAndWorkflow({ prompt: 'order pizza' });
    const r2 = await service.getIntentAndWorkflow({ prompt: 'order pizza' });
    expect(r1.intent).toBe(r2.intent);
    expect(r1.workflow.steps.length).toBe(r2.workflow.steps.length);
  });
});
