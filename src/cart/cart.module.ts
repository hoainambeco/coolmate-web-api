import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Carts, ItemCarts } from "./entities/cart.entity";
import { User } from "../users/entities/user.entity";
import { Product } from "../product/entities/product.entity";

@Module({
  imports : [TypeOrmModule.forFeature([ItemCarts, User,Product, Carts])],
  controllers: [CartController],
  providers: [CartService]
})
export class CartModule {}
