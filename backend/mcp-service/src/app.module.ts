import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { McpRoutingModule } from './routing/mcp-routing.module';

@Module({
  imports: [McpRoutingModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
