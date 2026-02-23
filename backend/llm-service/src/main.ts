import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getLlmConfig, validateLlmConfig } from './config/llm.config';

async function bootstrap() {
  const config = getLlmConfig();
  const { valid, errors } = validateLlmConfig(config);
  if (!valid) {
    errors.forEach((e) => console.warn('[LLM config]', e));
  }
  const app = await NestFactory.create(AppModule);
  const port = process.env.LLM_SERVICE_PORT || 3006;
  await app.listen(port);
  console.log(`LLM Service listening on ${port}`);
}
bootstrap();
