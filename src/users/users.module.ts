import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Favorite, User, Notification } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "../auth/auth.module";
import { Product } from "../product/entities/product.entity";
import { Oder } from "../oders/entities/oder.entity";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, Product, Favorite, Notification, Oder]),PassportModule
  ],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
