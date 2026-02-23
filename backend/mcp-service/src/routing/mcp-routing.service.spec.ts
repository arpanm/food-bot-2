import { Test, TestingModule } from '@nestjs/testing';
import { McpRoutingService } from './mcp-routing.service';

describe('McpRoutingService', () => {
  let service: McpRoutingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [McpRoutingService],
    }).compile();
    service = module.get<McpRoutingService>(McpRoutingService);
  });

  it('getToolRegistry returns tools from enabled providers', () => {
    const tools = service.getToolRegistry();
    expect(Array.isArray(tools)).toBe(true);
    tools.forEach((t) => {
      expect(t).toHaveProperty('name');
      expect(t).toHaveProperty('description');
      expect(t).toHaveProperty('provider');
    });
  });

  it('getToolRegistry includes provider for each tool', () => {
    const tools = service.getToolRegistry();
    const providers = [...new Set(tools.map((t) => t.provider))];
    expect(providers.every((p) => ['internal', 'swiggy', 'zomato', 'ondc'].includes(p))).toBe(true);
  });
});
