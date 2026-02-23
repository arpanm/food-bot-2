import { getMcpConfig } from './mcp.config';

describe('mcp.config (T005)', () => {
  const origEnv = process.env;

  afterEach(() => {
    process.env = { ...origEnv };
  });

  it('returns default URLs when env not set', () => {
    const config = getMcpConfig();
    expect(config.swiggy.url).toBeDefined();
    expect(config.zomato.url).toBeDefined();
    expect(config.ondc.url).toBeDefined();
  });

  it('reads MCP_SWIGGY_ENABLED from env', () => {
    process.env.MCP_SWIGGY_ENABLED = 'true';
    expect(getMcpConfig().swiggy.enabled).toBe(true);
    process.env.MCP_SWIGGY_ENABLED = 'false';
    expect(getMcpConfig().swiggy.enabled).toBe(false);
  });

  it('reads MCP_ONDC_MOCK from env', () => {
    process.env.MCP_ONDC_MOCK = 'true';
    expect(getMcpConfig().ondc.mock).toBe(true);
  });
});
