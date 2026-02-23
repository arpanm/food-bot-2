import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = process.env.RESTAURANT_SERVICE_PORT || 3002;
  await app.listen(port);
  console.log(`Restaurant Service listening on ${port}`);
}
bootstrap();
