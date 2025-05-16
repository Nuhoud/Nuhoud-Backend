import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { EmailsService } from './email.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: 
  [ 
    ClientsModule.register([
      {
        name: 'EMAILS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'alerts',
          protoPath: join(__dirname, '../proto/alerts.proto' ),
          url: process.env.ALERTS_GRPC_URL,
        },
      },
    ]),
  ],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
