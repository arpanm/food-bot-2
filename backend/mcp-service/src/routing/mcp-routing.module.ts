import { Module } from '@nestjs/common';
import { McpRoutingController } from './mcp-routing.controller';
import { McpRoutingService } from './mcp-routing.service';

@Module({
  controllers: [McpRoutingController],
  providers: [McpRoutingService],
  exports: [McpRoutingService],
})
export class McpRoutingModule {}
