import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from './users.service';
import { FavoriteVoucherController, QuanController, UsersController } from "./users.controller";
import { Favorite, User, Notification, FavoriteVoucher } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "../auth/auth.module";
import { Product } from "../product/entities/product.entity";
import { Oder } from "../oders/entities/oder.entity";
import { Voucher } from "../voucher/entities/voucher.entity";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, Product, Favorite, Notification, Oder, FavoriteVoucher, Voucher]),PassportModule
  ],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
  controllers: [UsersController,FavoriteVoucherController,QuanController],
})
export class UsersModule {}
