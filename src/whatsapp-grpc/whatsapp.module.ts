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
          package: 'whatsapp',
          protoPath: join(__dirname, 'proto/whatsapp.proto'),
          url: process.env.WHATSAPP_GRPC_URL,
        },
      },
    ]),
  ],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}
