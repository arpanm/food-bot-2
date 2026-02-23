export async function callMcpTool(params: {
  provider: string;
  tool: string;
  arguments: Record<string, unknown>;
}): Promise<unknown> {
  return { provider: params.provider, tool: params.tool, success: true };
}
