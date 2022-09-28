import { Global, Module } from '@nestjs/common';
import { ConfigService } from './service/config.service';

@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class SharedModule {}
