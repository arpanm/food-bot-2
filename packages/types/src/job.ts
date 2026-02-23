/** Job and workflow types for async chat and workflow execution */

export interface JobStatus {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  messages: Array<{ role: string; content: string; data?: unknown }>;
  updatedAt: string;
}

export interface WorkflowStep {
  id: string;
  type: string;
  params: Record<string, unknown>;
  result?: unknown;
}

export interface IntentWorkflow {
  intent: string;
  workflow: {
    steps: WorkflowStep[];
  };
}
