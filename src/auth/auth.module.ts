import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();
import { OtpModule } from 'src/otp/otp.module';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '7d' },
          }),
        OtpModule,
        EmailModule
      ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
