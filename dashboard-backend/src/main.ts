import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, LogLevel } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const loggerConfig: LogLevel[] =
    process.env.IS_PROD === 'true'
      ? ['error', 'warn', 'log']
      : ['error', 'warn', 'log', 'verbose', 'debug'];

  const app = await NestFactory.create(AppModule, {
    logger: loggerConfig,
  });
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Dashboard API')
    .setDescription('The dashboard API description')
    .setVersion('1.0')
    .addTag('dashboard')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
