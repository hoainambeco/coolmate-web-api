import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./entities/cart.entity";
import { User } from "../users/entities/user.entity";
import { Product } from "../product/entities/product.entity";

@Module({
  imports : [TypeOrmModule.forFeature([Cart, User,Product])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
