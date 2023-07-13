import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function setupSwaggerDocs(app) {
  const docConfig = new DocumentBuilder()
    .setTitle('Desafio Green Acesso API')
    .setDescription('API reference for Desafio Green Acesso API')
    .setVersion('0.1')
    .addServer('http://localhost:3000')
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, docConfig);

  SwaggerModule.setup('/', app, swaggerDoc, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Desafio Green Acesso API Docs',
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwaggerDocs(app);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
