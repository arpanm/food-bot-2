import { Body, Controller, Get, Post } from '@nestjs/common';
import type { CallToolParams } from './mcp-routing.service';
import { McpRoutingService } from './mcp-routing.service';

@Controller('mcp')
export class McpRoutingController {
  constructor(private readonly routing: McpRoutingService) {}

  @Get('tools')
  listTools() {
    return { tools: this.routing.getToolRegistry() };
  }

  @Post('call')
  async callTool(@Body() params: CallToolParams) {
    return this.routing.callTool(params);
  }
}
