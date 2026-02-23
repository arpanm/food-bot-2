import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1'); // T006: API versioning
  app.enableCors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true });
  const port = process.env.API_GATEWAY_PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Food Bot 2 API')
    .setDescription(
      'API Gateway and aggregated API documentation. All customer and restaurant flows are proxied through this gateway.'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, { useGlobalPrefix: true }); // docs show /v1 routes

  await app.listen(port);
  console.log(`API Gateway listening on ${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api`);
}
bootstrap();
