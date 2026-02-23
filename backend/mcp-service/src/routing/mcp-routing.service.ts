import { Injectable } from '@nestjs/common';
import { getMcpConfig, type McpConfig } from '../config/mcp.config';
import { CircuitBreaker } from './circuit-breaker';

export interface ToolDef {
  name: string;
  description: string;
  provider: string;
}

export interface CallToolParams {
  provider: string;
  toolName: string;
  args?: Record<string, unknown>;
}

@Injectable()
export class McpRoutingService {
  private config: McpConfig = getMcpConfig();
  private breakers = new Map<string, CircuitBreaker>();

  /** Returns tool registry: all tools from enabled providers. */
  getToolRegistry(): ToolDef[] {
    const tools: ToolDef[] = [];
    if (this.config.internal.enabled) {
      tools.push(
        {
          name: 'search_restaurants',
          description: 'Search restaurants (internal)',
          provider: 'internal',
        },
        { name: 'get_menu', description: 'Get restaurant menu (internal)', provider: 'internal' },
        { name: 'place_order', description: 'Place order (internal)', provider: 'internal' }
      );
    }
    if (this.config.swiggy.enabled) {
      tools.push(
        {
          name: 'search_restaurants',
          description: 'Search restaurants (Swiggy)',
          provider: 'swiggy',
        },
        { name: 'get_menu', description: 'Get menu (Swiggy)', provider: 'swiggy' },
        { name: 'add_to_cart', description: 'Add to cart (Swiggy)', provider: 'swiggy' },
        { name: 'place_order', description: 'Place order (Swiggy)', provider: 'swiggy' }
      );
    }
    if (this.config.zomato.enabled) {
      tools.push(
        {
          name: 'search_restaurants',
          description: 'Search restaurants (Zomato)',
          provider: 'zomato',
        },
        { name: 'get_menu', description: 'Get menu (Zomato)', provider: 'zomato' },
        { name: 'place_order', description: 'Place order (Zomato)', provider: 'zomato' }
      );
    }
    if (this.config.ondc.enabled) {
      tools.push(
        { name: 'search', description: 'Search catalog (ONDC)', provider: 'ondc' },
        { name: 'init_order', description: 'Initialize order (ONDC)', provider: 'ondc' },
        { name: 'confirm_order', description: 'Confirm order (ONDC)', provider: 'ondc' }
      );
    }
    return tools;
  }

  /** Route tool call to the configured provider URL (with circuit breaker). */
  async callTool(params: CallToolParams): Promise<{ content: unknown }> {
    const cfg = this.getProviderConfig(params.provider);
    if (!cfg?.enabled) {
      throw new Error(`Provider ${params.provider} is not enabled`);
    }
    let breaker = this.breakers.get(params.provider);
    if (!breaker) {
      breaker = new CircuitBreaker(3, 30000);
      this.breakers.set(params.provider, breaker);
    }
    return breaker.execute(async () => {
      const url = `${cfg.url.replace(/\/$/, '')}/tools/call`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: params.toolName, arguments: params.args ?? {} }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`MCP call failed: ${res.status} ${text}`);
      }
      const data = (await res.json()) as { content?: unknown };
      return { content: data.content ?? data };
    });
  }

  private getProviderConfig(provider: string): { enabled: boolean; url: string } | null {
    switch (provider) {
      case 'internal':
        return this.config.internal;
      case 'swiggy':
        return this.config.swiggy;
      case 'zomato':
        return this.config.zomato;
      case 'ondc':
        return this.config.ondc;
      default:
        return null;
    }
  }
}
