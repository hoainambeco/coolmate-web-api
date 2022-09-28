import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SharedModule } from "./shared/shared.module";
import { AuthService } from "./auth/auth.service";
import { ContextMiddleware } from "./middlewares/context.middleware";
import { UsersService } from "./users/users.service";
import { JwtStrategy } from "./auth/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'mongodb',
      url: 'mongodb+srv://hoainambeco:01684490544Fe@cluster0.f6gva.mongodb.net/db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: true,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  ),
    AuthModule,
    UsersModule,
    SharedModule],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }}
