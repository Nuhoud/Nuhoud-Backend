import { Module } from '@nestjs/common';
import { AiserviceService } from './aiservice.service';
import { AiserviceController } from './aiservice.controller';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [HttpModule],
  controllers: [AiserviceController],
  providers: [AiserviceService],
  exports: [AiserviceService],
})
export class AiserviceModule {}
