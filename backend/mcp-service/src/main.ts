import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.MCP_SERVICE_PORT || 3007;
  await app.listen(port);
  console.log(`MCP Service listening on ${port}`);
}
bootstrap();
