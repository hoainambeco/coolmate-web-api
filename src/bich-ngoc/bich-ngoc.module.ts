import { Module } from '@nestjs/common';
import { BichNgocService } from './bich-ngoc.service';
import { BichNgocController } from './bich-ngoc.controller';

@Module({
  controllers: [BichNgocController],
  providers: [BichNgocService]
})
export class BichNgocModule {}
