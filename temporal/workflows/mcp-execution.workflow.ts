import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/mcp-execution.activities';

const { callMcpTool } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30s',
  retry: { maximumAttempts: 3 },
});

export interface McpExecutionWorkflowInput {
  jobId: string;
  provider: 'internal' | 'swiggy' | 'zomato' | 'ondc';
  steps: Array<{ tool: string; arguments: Record<string, unknown> }>;
}

export async function mcpExecutionWorkflow(
  input: McpExecutionWorkflowInput
): Promise<{ success: boolean; results: unknown[] }> {
  const results: unknown[] = [];
  for (const step of input.steps) {
    const result = await callMcpTool({
      provider: input.provider,
      tool: step.tool,
      arguments: step.arguments,
    });
    results.push(result);
  }
  return { success: true, results };
}
