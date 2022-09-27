import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as compression from 'compression';
import * as express from 'express';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { loadEnviroment } from './env';
import { setupSwagger } from './swagger.setup';
import helmet from "helmet";

async function bootstrap() {

  loadEnviroment();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.use(compression());
  app.use(morgan('combined'));

  app.use('/uploads', express.static('uploads'));

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    setupSwagger(app);
  app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        dismissDefaultMessages: true,
        validationError: {
          target: false,
        },
        exceptionFactory: (errors) => new BadRequestException(errors),
      }),
  );
  await app.listen(3000);
  Logger.debug(`Application is running on: ${await app.getUrl()}`, 'Main');
}
bootstrap();
