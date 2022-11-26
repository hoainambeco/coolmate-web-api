import { Oder } from './entities/oder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OdersService } from './oders.service';
import { OdersController } from './oders.controller';
import { Voucher } from "../voucher/entities/voucher.entity";
import { Cart } from "../cart/entities/cart.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Oder, Voucher, Cart])],
  controllers: [OdersController],
  providers: [OdersService],
  exports:[TypeOrmModule,OdersService],
})
export class OdersModule {}
