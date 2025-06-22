import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { WhatsappService } from './whatsapp.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [ 
    ClientsModule.register([
      {
        name: 'WHATSAPP_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'alerts',
          protoPath: join(__dirname, '../proto/alerts.proto' ),
          url: process.env.ALERTS_GRPC_URL || 'localhost:50051',
        },
      },
    ]),
  ],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
