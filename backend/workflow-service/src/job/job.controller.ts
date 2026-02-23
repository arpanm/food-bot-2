import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateJobDto, UpdateStepDto } from './dto/job.dto';
import { JobService } from './job.service';

@Controller('jobs')
export class JobController {
  constructor(private readonly job: JobService) {}

  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.job.createJob(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.job.getJobOrThrow(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'pending' | 'running' | 'completed' | 'failed' }
  ) {
    return this.job.updateJobStatus(id, body.status);
  }

  @Patch(':id/steps/:stepId')
  updateStep(@Param('id') id: string, @Param('stepId') stepId: string, @Body() dto: UpdateStepDto) {
    return this.job.updateStepStatus(id, stepId, dto);
  }

  @Post(':id/messages')
  addMessage(
    @Param('id') id: string,
    @Body() body: { role: string; content: string; data?: unknown }
  ) {
    return this.job.addMessage(id, body.role, body.content, body.data);
  }
}
