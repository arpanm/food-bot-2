export type JobStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface WorkflowStepStatus {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: unknown;
}

export interface JobDto {
  jobId: string;
  userId: string;
  prompt: string;
  workflowJson: Record<string, unknown>;
  status: JobStatus;
  steps: WorkflowStepStatus[];
  messages: Array<{ role: string; content: string; data?: unknown }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobDto {
  userId: string;
  prompt: string;
  workflow: { steps: Array<{ id: string; type: string; params: Record<string, unknown> }> };
}

export interface UpdateStepDto {
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: unknown;
}
