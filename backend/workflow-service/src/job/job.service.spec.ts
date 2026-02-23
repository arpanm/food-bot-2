import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JobService } from './job.service';

describe('JobService', () => {
  let service: JobService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobService],
    }).compile();
    service = module.get<JobService>(JobService);
  });

  it('createJob returns job with workflow steps', () => {
    const job = service.createJob({
      userId: 'u1',
      prompt: 'order biryani',
      workflow: {
        steps: [
          { id: 's1', type: 'search', params: {} },
          { id: 's2', type: 'checkout', params: {} },
        ],
      },
    });
    expect(job.jobId).toBeDefined();
    expect(job.status).toBe('pending');
    expect(job.steps).toHaveLength(2);
    expect(job.steps[0].status).toBe('pending');
  });

  it('getJobOrThrow throws for unknown id', () => {
    expect(() => service.getJobOrThrow('job-unknown')).toThrow(NotFoundException);
  });

  it('updateStepStatus updates step and job status', () => {
    const job = service.createJob({
      userId: 'u1',
      prompt: 'p',
      workflow: { steps: [{ id: 's1', type: 'search', params: {} }] },
    });
    const updated = service.updateStepStatus(job.jobId, 's1', {
      status: 'completed',
      result: { count: 5 },
    });
    expect(updated.steps[0].status).toBe('completed');
    expect(updated.steps[0].result).toEqual({ count: 5 });
    expect(updated.status).toBe('completed');
  });

  it('addMessage appends message', () => {
    const job = service.createJob({ userId: 'u1', prompt: 'p', workflow: { steps: [] } });
    const updated = service.addMessage(job.jobId, 'assistant', 'Here are your results.');
    expect(updated.messages).toHaveLength(1);
    expect(updated.messages[0].role).toBe('assistant');
    expect(updated.messages[0].content).toBe('Here are your results.');
  });
});
