import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChatController, JobsController } from './chat.controller';
import { WorkflowProxyService } from './workflow-proxy/workflow-proxy.service';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: WorkflowProxyService,
          useValue: {
            createJob: jest.fn().mockResolvedValue({ jobId: 'job-123-abc' }),
          },
        },
      ],
    }).compile();
    controller = app.get<ChatController>(ChatController);
  });

  it('POST /chat/prompt accepts prompt and returns jobId', async () => {
    const result = await controller.submitPrompt({ prompt: 'Find biryani' });
    expect(result).toHaveProperty('jobId');
    expect(result.jobId).toBe('job-123-abc');
  });
});

describe('JobsController', () => {
  let controller: JobsController;
  const mockJob = {
    jobId: 'job-123',
    userId: 'u1',
    prompt: 'test',
    workflowJson: {},
    status: 'pending',
    steps: [],
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: WorkflowProxyService,
          useValue: {
            getJob: jest.fn().mockImplementation((id: string) => {
              if (id === 'job-unknown-xyz') return Promise.resolve(null);
              return Promise.resolve({
                ...mockJob,
                jobId: id,
                status: id === 'job-completed' ? 'completed' : 'pending',
                messages:
                  id === 'job-completed'
                    ? [{ role: 'assistant', content: 'Here are 3 restaurants.' }]
                    : [],
              });
            }),
          },
        },
      ],
    }).compile();
    controller = app.get<JobsController>(JobsController);
  });

  it('GET /jobs/:id/status returns status and messages from workflow', async () => {
    const pending = await controller.getStatus('job-123');
    expect(pending.status).toBe('pending');
    expect(pending.messages).toBeUndefined();

    const completed = await controller.getStatus('job-completed');
    expect(completed.status).toBe('completed');
    expect(Array.isArray(completed.messages)).toBe(true);
    expect(completed.messages!.length).toBeGreaterThan(0);
    expect(completed.messages![0]).toHaveProperty('role', 'assistant');
  });

  it('GET /jobs/:id/status returns 404 for unknown jobId', async () => {
    await expect(controller.getStatus('job-unknown-xyz')).rejects.toThrow(
      NotFoundException
    );
  });
});
