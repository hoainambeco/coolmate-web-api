import { Oder } from './entities/oder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OdersService } from './oders.service';
import { OdersController } from './oders.controller';
import { Voucher } from "../voucher/entities/voucher.entity";
import { Carts, ItemCarts } from "../cart/entities/cart.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Oder, Voucher, ItemCarts,Carts])],
  controllers: [OdersController],
  providers: [OdersService],
  exports:[TypeOrmModule,OdersService],
})
export class OdersModule {}
