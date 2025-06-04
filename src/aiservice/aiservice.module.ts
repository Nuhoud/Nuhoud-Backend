import { Module } from '@nestjs/common';
import { AiserviceService } from './aiservice.service';
import { AiserviceController } from './aiservice.controller';

@Module({
  controllers: [AiserviceController],
  providers: [AiserviceService],
  exports: [AiserviceService],
})
export class AiserviceModule {}
