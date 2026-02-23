import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  CreateJobDto,
  JobDto,
  JobStatus,
  UpdateStepDto,
  WorkflowStepStatus,
} from './dto/job.dto';

@Injectable()
export class JobService {
  private jobs = new Map<string, JobDto>();
  private nextId = 1;

  createJob(dto: CreateJobDto): JobDto {
    const jobId = `job-${Date.now()}-${this.nextId++}`;
    const now = new Date().toISOString();
    const steps: WorkflowStepStatus[] = (dto.workflow?.steps ?? []).map((s) => ({
      id: s.id,
      type: s.type,
      status: 'pending' as const,
    }));
    const job: JobDto = {
      jobId,
      userId: dto.userId,
      prompt: dto.prompt,
      workflowJson: dto.workflow as unknown as Record<string, unknown>,
      status: 'pending',
      steps,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    this.jobs.set(jobId, job);
    return { ...job };
  }

  getJob(jobId: string): JobDto | null {
    const j = this.jobs.get(jobId);
    return j ? { ...j } : null;
  }

  getJobOrThrow(jobId: string): JobDto {
    const j = this.getJob(jobId);
    if (!j) throw new NotFoundException('Job not found');
    return j;
  }

  updateJobStatus(jobId: string, status: JobStatus): JobDto {
    const j = this.getJobOrThrow(jobId);
    j.status = status;
    j.updatedAt = new Date().toISOString();
    return { ...j };
  }

  updateStepStatus(jobId: string, stepId: string, dto: UpdateStepDto): JobDto {
    const j = this.getJobOrThrow(jobId);
    const step = j.steps.find((s) => s.id === stepId);
    if (!step) throw new NotFoundException('Step not found');
    step.status = dto.status;
    if (dto.result !== undefined) step.result = dto.result;
    j.updatedAt = new Date().toISOString();
    if (dto.status === 'running') j.status = 'running';
    if (j.steps.every((s) => s.status === 'completed' || s.status === 'failed')) {
      j.status = j.steps.some((s) => s.status === 'failed') ? 'failed' : 'completed';
    }
    return { ...j };
  }

  addMessage(jobId: string, role: string, content: string, data?: unknown): JobDto {
    const j = this.getJobOrThrow(jobId);
    j.messages.push({ role, content, data });
    j.updatedAt = new Date().toISOString();
    return { ...j };
  }
}
