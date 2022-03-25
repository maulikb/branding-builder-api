import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { CustomValidationPipe } from 'src/app/common/pipes/custom-validation.pipe';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { environment } from './environments';
import logger from './app/common/logger';
import express from 'express';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });
  app.use('/public', express.static(path.join(__dirname, 'public/temp')));
  // app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors({
    origin: environment.allowedOrigins,
  });
  const config = new DocumentBuilder()
    .setTitle('Branding Builder API')
    .setDescription('Branding Builder Backend APIs')
    .setVersion('0.0')
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalPipes(new CustomValidationPipe());
  await app.listen(process.env.HOST_PORT);
}
bootstrap();
