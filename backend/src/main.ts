import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AuthResponse } from './auth/dto/auth.dto';
import {
  ChatResponse,
  ReplyResponse,
} from './generate/dto/generate-responses.dto';
import { FeedbackResponse } from './feedback/dto/feedback-response.dto';
import { CheckoutResponse } from './checkout/dto/checkout.dto';
import { AppLogger } from './logger/logger.service'
import { AllExceptionsFilter } from './common/filters/exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Charm AI')
    .setDescription('The API description for the Charm AI backend')
    .setVersion('1.0')
    .setContact(
      'Kostiantyn',
      'https://github.com/ostapenko-kostia',
      'ostapenkokpersonal@gmail.com',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      AuthResponse,
      ReplyResponse,
      ChatResponse,
      FeedbackResponse,
      CheckoutResponse,
    ],
  });
  SwaggerModule.setup('/docs', app, document, {
    customSiteTitle: 'Charm AI - Docs',
  });

  const logger = app.get(AppLogger);
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  await app.listen(3000);
}

bootstrap();
