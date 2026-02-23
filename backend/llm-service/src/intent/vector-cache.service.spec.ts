import { Test, TestingModule } from '@nestjs/testing';
import type { IntentWorkflowResult } from './dto/intent.dto';
import { VectorCacheService } from './vector-cache.service';

describe('VectorCacheService', () => {
  let service: VectorCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VectorCacheService],
    }).compile();
    service = module.get<VectorCacheService>(VectorCacheService);
  });

  it('get returns null for uncached prompt', () => {
    expect(service.get('hello')).toBeNull();
  });

  it('set and get round-trip', () => {
    const value: IntentWorkflowResult = {
      intent: 'search',
      workflow: { steps: [{ id: '1', type: 'search', params: {} }] },
    };
    service.set('find biryani', value);
    expect(service.get('find biryani')).toEqual(value);
  });

  it('cache hit reduces LLM calls (same prompt key)', () => {
    const value: IntentWorkflowResult = {
      intent: 'order',
      workflow: { steps: [] },
    };
    service.set('order food', value);
    expect(service.get('order food')).toEqual(value);
  });
});
