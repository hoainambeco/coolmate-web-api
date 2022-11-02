import { Oder } from './entities/oder.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OdersService } from './oders.service';
import { OdersController } from './oders.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Oder])],
  controllers: [OdersController],
  providers: [OdersService],
})
export class OdersModule {}
