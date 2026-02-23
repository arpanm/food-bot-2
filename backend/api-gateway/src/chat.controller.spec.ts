import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ChatController, JobsController } from './chat.controller';

describe('ChatController', () => {
  let controller: ChatController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
    }).compile();
    controller = app.get<ChatController>(ChatController);
  });

  it('POST /chat/prompt accepts prompt and returns jobId', () => {
    const result = controller.submitPrompt({ prompt: 'Find biryani' });
    expect(result).toHaveProperty('jobId');
    expect(result.jobId).toMatch(/^job-\d+-[a-z0-9]+$/);
  });

  it('returns unique jobId for each request', () => {
    const a = controller.submitPrompt({ prompt: 'A' });
    const b = controller.submitPrompt({ prompt: 'B' });
    expect(a.jobId).not.toBe(b.jobId);
  });
});

describe('JobsController', () => {
  let controller: JobsController;
  let chatController: ChatController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatController, JobsController],
    }).compile();
    controller = app.get<JobsController>(JobsController);
    chatController = app.get<ChatController>(ChatController);
  });

  it('GET /jobs/:id/status returns pending then completed with messages', (done) => {
    const { jobId } = chatController.submitPrompt({ prompt: 'test' });
    const first = controller.getStatus(jobId);
    expect(first.status).toBe('pending');
    expect(first.messages).toBeUndefined();
    setTimeout(() => {
      const second = controller.getStatus(jobId);
      expect(second.status).toBe('completed');
      expect(Array.isArray(second.messages)).toBe(true);
      expect(second.messages!.length).toBeGreaterThan(0);
      expect(second.messages![0]).toHaveProperty('role', 'assistant');
      expect(second.messages![0]).toHaveProperty('content');
      done();
    }, 1600);
  }, 3000);

  it('GET /jobs/:id/status returns 404 for unknown jobId', () => {
    expect(() => controller.getStatus('job-unknown-xyz')).toThrow(NotFoundException);
  });
});
