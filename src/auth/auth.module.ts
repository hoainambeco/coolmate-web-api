import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtModuleOptions, JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigService } from "../shared/service/config.service";
import { GoogleStrategy } from "./google.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: config.getNumber('JWT_EXPIRATION_TIME'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy, UsersService, GoogleStrategy],
})
export class AuthModule {}
