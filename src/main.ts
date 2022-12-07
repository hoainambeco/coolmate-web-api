import {
  BadRequestException,
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import * as compression from "compression";
import * as express from "express";
import * as morgan from "morgan";
import { AppModule } from "./app.module";
import { loadEnviroment } from "./env";
import { setupSwagger } from "./swagger.setup";
import helmet from "helmet";
import * as session from "express-session";
import * as passport from "passport";
import { fcmSetup } from "./fcm.setup";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";


async function bootstrap() {

  loadEnviroment();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable("x-powered-by");

  app.enableCors();
  app.use(compression());
  app.use(morgan("combined"));

  app.use("/uploads", express.static("uploads"));

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  setupSwagger(app);
  // fcmSetup();
  const adminConfig: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      validationError: {
        target: false
      },
      exceptionFactory: (errors) => new BadRequestException(errors)
    })
  );
  app.useStaticAssets(join(__dirname, "..", "public"));
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("hbs");
  app.use(
    session({
      secret: "datn-secret",
      resave: true,
      saveUninitialized: true
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(process.env.PORT || 3000);
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       directives: {
  //         defaultSrc: [`'self'`],
  //         styleSrc: [`'self'`, `'unsafe-inline'`],
  //         imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
  //         scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
  //       },
  //     },
  //   }),
  // );
  app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: [`'self'`, `https:`],
            styleSrc: [`'self'`, `'unsafe-inline'`, `https:`],
            imgSrc: [`'self'`, "data:", "validator.swagger.io", `https:`],
            scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
            fontSrc: [`'self'`, `https:`, `data:`],
            connectSrc: [`'self'`, `https:`, `wss:`],
            frameSrc: [`'self'`, `https:`, `wss:`],
            objectSrc: [`'self'`, `https:`, `wss:`],
            mediaSrc: [`'self'`, `https:`, `wss:`],
            frameAncestors: [`'self'`],
            formAction: [`'self'`],
            baseUri: [`'self'`],
            manifestSrc: [`'self'`],
            workerSrc: [`'self'`],
            childSrc: [`'self'`],
            prefetchSrc: [`'self'`],
            cssSrc: [`'self'`],
            url: [`'self'`],
          }
        },
        xssFilter: true
      })
    );
  Logger.debug(`Application is running on: ${await app.getUrl()}`, "Main");
}

bootstrap();
