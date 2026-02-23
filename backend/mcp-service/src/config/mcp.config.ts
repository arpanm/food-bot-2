/**
 * T005: MCP provider configuration from env. Enable/disable and URL per provider.
 */
export interface McpProviderConfig {
  enabled: boolean;
  url: string;
  mock: boolean;
}

export interface McpConfig {
  swiggy: McpProviderConfig;
  zomato: McpProviderConfig;
  ondc: McpProviderConfig;
  internal: McpProviderConfig;
}

function readBool(env: string | undefined): boolean {
  if (env === undefined || env === '') return false;
  return env.toLowerCase() === 'true' || env === '1';
}

export function getMcpConfig(): McpConfig {
  return {
    swiggy: {
      enabled: readBool(process.env.MCP_SWIGGY_ENABLED),
      url: process.env.MCP_SWIGGY_URL ?? 'https://mcp.swiggy.com/food',
      mock: readBool(process.env.MCP_SWIGGY_MOCK),
    },
    zomato: {
      enabled: readBool(process.env.MCP_ZOMATO_ENABLED),
      url: process.env.MCP_ZOMATO_URL ?? 'https://mcp-server.zomato.com/mcp',
      mock: readBool(process.env.MCP_ZOMATO_MOCK),
    },
    ondc: {
      enabled: readBool(process.env.MCP_ONDC_ENABLED),
      url: process.env.MCP_ONDC_URL ?? 'http://localhost:3200',
      mock: readBool(process.env.MCP_ONDC_MOCK),
    },
    internal: {
      enabled: readBool(process.env.MCP_INTERNAL_ENABLED),
      url: process.env.MCP_INTERNAL_URL ?? 'http://localhost:3100',
      mock: false,
    },
  };
}
