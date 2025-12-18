import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from './otp/otp.module';
import { EmailsModule } from './emails/email.module';
import { WhatsappModule } from './whatsapp-grpc/whatsapp.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AiserviceModule } from './aiservice/aiservice.module';
import { ApplicationModule } from './application/application.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {FirebaseModule} from './firebase/firebase.module';
import { Minios3Module } from './minios3/minios3.module';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL || 'mongodb://localhost:27017/nuhoud'),
    AuthModule,
    // Load environment variables from the `.env` file and make ConfigService globally available across the entire application
    UsersModule,
    OtpModule,
    EmailsModule,
    WhatsappModule,
    ProfilesModule,
    AiserviceModule,
    ApplicationModule,
    ConfigModule.forRoot({isGlobal: true}),
    Minios3Module,
    FirebaseModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
