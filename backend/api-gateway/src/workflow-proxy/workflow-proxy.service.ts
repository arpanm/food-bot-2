import { HttpException, Injectable } from '@nestjs/common';

const WORKFLOW_SERVICE_URL =
  process.env.WORKFLOW_SERVICE_URL || 'http://localhost:3004';
const TIMEOUT_MS = 15000;

interface JobDto {
  jobId: string;
  userId: string;
  prompt: string;
  workflowJson: Record<string, unknown>;
  status: string;
  steps: Array<{ id: string; type: string; status: string; result?: unknown }>;
  messages: Array<{ role: string; content: string; data?: unknown }>;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class WorkflowProxyService {
  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${WORKFLOW_SERVICE_URL.replace(/\/$/, '')}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method,
        headers:
          method !== 'GET' && body !== undefined
            ? { 'Content-Type': 'application/json' }
            : {},
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const text = await res.text();
      if (!res.ok) {
        throw new HttpException(
          text || `Workflow service ${res.status}`,
          res.status
        );
      }
      return (text ? JSON.parse(text) : {}) as T;
    } catch (e) {
      clearTimeout(timeoutId);
      if (e instanceof HttpException) throw e;
      throw new HttpException(
        e instanceof Error ? e.message : 'Workflow service unavailable',
        502
      );
    }
  }

  async createJob(dto: {
    userId: string;
    prompt: string;
    workflow: { steps: Array<{ id: string; type: string; params: Record<string, unknown> }> };
  }): Promise<{ jobId: string }> {
    const job = await this.request<JobDto>('POST', '/jobs', dto);
    return { jobId: job.jobId };
  }

  async getJob(jobId: string): Promise<JobDto | null> {
    const url = `${WORKFLOW_SERVICE_URL.replace(/\/$/, '')}/jobs/${jobId}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.status === 404) return null;
      const text = await res.text();
      if (!res.ok)
        throw new HttpException(text || `Workflow service ${res.status}`, res.status);
      return (text ? JSON.parse(text) : null) as JobDto;
    } catch (e) {
      clearTimeout(timeoutId);
      if (e instanceof HttpException) throw e;
      throw new HttpException(
        e instanceof Error ? e.message : 'Workflow service unavailable',
        502
      );
    }
  }

  async updateStep(
    jobId: string,
    stepId: string,
    dto: { status: string; result?: unknown }
  ): Promise<JobDto> {
    return this.request<JobDto>('PATCH', `/jobs/${jobId}/steps/${stepId}`, dto);
  }

  async addMessage(
    jobId: string,
    role: string,
    content: string,
    data?: unknown
  ): Promise<JobDto> {
    return this.request<JobDto>('POST', `/jobs/${jobId}/messages`, {
      role,
      content,
      data,
    });
  }
}
