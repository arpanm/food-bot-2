import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PERSONALIZATION_SERVICE_PORT || 3008;
  await app.listen(port);
  console.log(`Personalization Service listening on ${port}`);
}
bootstrap();
