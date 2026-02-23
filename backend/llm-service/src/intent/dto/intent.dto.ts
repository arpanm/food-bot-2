export interface IntentWorkflowResult {
  intent: string;
  workflow: { steps: Array<{ id: string; type: string; params: Record<string, unknown> }> };
}

export interface IntentRequestDto {
  prompt: string;
  context?: Record<string, unknown>;
}
