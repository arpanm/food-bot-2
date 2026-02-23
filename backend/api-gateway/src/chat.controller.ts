import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';
import {
  ChatMessageDto,
  JobStatusResponseDto,
  PromptRequestDto,
  PromptResponseDto,
} from './dto/chat.dto';

// In-memory store for demo; replace with workflow/DB in production
const jobs = new Map<
  string,
  { status: 'pending' | 'completed' | 'failed'; messages: ChatMessageDto[] }
>();

@ApiTags('Chat')
@Controller('chat')
@Public()
export class ChatController {
  @Post('prompt')
  @ApiOperation({
    summary: 'Submit a chat prompt',
    description:
      'Submits a user prompt and returns a job ID. Poll GET /jobs/:jobId/status for results.',
  })
  @ApiResponse({ status: 201, description: 'Job created', type: PromptResponseDto })
  submitPrompt(@Body() dto: PromptRequestDto): PromptResponseDto {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    jobs.set(jobId, {
      status: 'pending',
      messages: [],
    });
    // Simulate async completion after a short delay
    setTimeout(() => {
      const job = jobs.get(jobId);
      if (job) {
        job.status = 'completed';
        job.messages = [
          {
            role: 'assistant',
            content: `You asked: "${dto.prompt}". Here are 3 restaurants that match: 1) Biryani House (4.2), 2) Spice Garden (4.0), 3) Tasty Bites (4.5). Say "order from <name>" to place an order.`,
          },
        ];
      }
    }, 1500);
    return { jobId };
  }
}

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  @Get(':id/status')
  @ApiOperation({
    summary: 'Get job status',
    description:
      'Returns the current status and messages for a chat job. Poll until status is completed or failed.',
  })
  @ApiParam({ name: 'id', description: 'Job ID returned from POST /chat/prompt' })
  @ApiResponse({ status: 200, description: 'Job status and messages', type: JobStatusResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found' })
  getStatus(@Param('id') id: string): JobStatusResponseDto {
    const job = jobs.get(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return {
      status: job.status,
      messages: job.messages.length ? job.messages : undefined,
    };
  }
}
