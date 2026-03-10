import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './auth/public.decorator';
import {
  JobStatusResponseDto,
  PromptRequestDto,
  PromptResponseDto,
} from './dto/chat.dto';
import { WorkflowProxyService } from './workflow-proxy/workflow-proxy.service';

@ApiTags('Chat')
@Controller('chat')
@Public()
export class ChatController {
  constructor(private readonly workflow: WorkflowProxyService) {}

  @Post('prompt')
  @ApiOperation({
    summary: 'Submit a chat prompt',
    description:
      'Submits a user prompt and returns a job ID. Poll GET /jobs/:jobId/status for results. Chrome extension can fetch the job and execute workflow steps.',
  })
  @ApiResponse({ status: 201, description: 'Job created', type: PromptResponseDto })
  async submitPrompt(@Body() dto: PromptRequestDto): Promise<PromptResponseDto> {
    const { jobId } = await this.workflow.createJob({
      userId: 'anonymous',
      prompt: dto.prompt,
      workflow: {
        steps: [{ id: 's1', type: 'search', params: { query: dto.prompt } }],
      },
    });
    return { jobId };
  }
}

@ApiTags('Jobs')
@Controller('jobs')
@Public()
export class JobsController {
  constructor(private readonly workflow: WorkflowProxyService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get full job (for Chrome extension)',
    description: 'Returns the full job including workflow JSON for browser execution.',
  })
  @ApiParam({ name: 'id', description: 'Job ID' })
  async getJob(@Param('id') id: string): Promise<unknown> {
    const job = await this.workflow.getJob(id);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  @Get(':id/status')
  @ApiOperation({
    summary: 'Get job status',
    description:
      'Returns the current status and messages for a chat job. Poll until status is completed or failed.',
  })
  @ApiParam({ name: 'id', description: 'Job ID returned from POST /chat/prompt' })
  @ApiResponse({ status: 200, description: 'Job status and messages', type: JobStatusResponseDto })
  @ApiResponse({ status: 404, description: 'Job not found' })
  async getStatus(@Param('id') id: string): Promise<JobStatusResponseDto> {
    const job = await this.workflow.getJob(id);
    if (!job) throw new NotFoundException('Job not found');
    return {
      status: job.status as JobStatusResponseDto['status'],
      messages: job.messages?.length ? job.messages : undefined,
    };
  }

  @Patch(':id/steps/:stepId')
  @ApiOperation({ summary: 'Update step status (Chrome extension)' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiParam({ name: 'stepId', description: 'Step ID' })
  async updateStep(
    @Param('id') id: string,
    @Param('stepId') stepId: string,
    @Body() body: { status: string; result?: unknown }
  ): Promise<unknown> {
    return this.workflow.updateStep(id, stepId, body) as Promise<unknown>;
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Add message to job (Chrome extension)' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  async addMessage(
    @Param('id') id: string,
    @Body() body: { role: string; content: string; data?: unknown }
  ): Promise<unknown> {
    return this.workflow.addMessage(id, body.role, body.content, body.data) as Promise<unknown>;
  }
}
