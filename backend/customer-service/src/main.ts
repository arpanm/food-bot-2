import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const port = process.env.CUSTOMER_SERVICE_PORT || 3001;
  await app.listen(port);
  console.log(`Customer Service listening on ${port}`);
}
bootstrap();
