import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OtpService } from './otp.service'
import { Otp, OtpSchema } from './entities/otp.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OtpSchema }]),
    ConfigModule,
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
