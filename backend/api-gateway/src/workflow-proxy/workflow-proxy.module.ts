import { Module } from '@nestjs/common';
import { WorkflowProxyService } from './workflow-proxy.service';

@Module({
  providers: [WorkflowProxyService],
  exports: [WorkflowProxyService],
})
export class WorkflowProxyModule {}
