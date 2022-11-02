import { Module } from '@nestjs/common';
import { OdersService } from './oders.service';
import { OdersController } from './oders.controller';

@Module({
  controllers: [OdersController],
  providers: [OdersService]
})
export class OdersModule {}
