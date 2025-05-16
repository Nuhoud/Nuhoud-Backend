import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { Observable } from 'rxjs';
import * as dotenv from 'dotenv';
dotenv.config();

interface SendMessageRequest {
  mobileNumber: string;
  message: string;
}

interface SendMessageResponse {
  ok: boolean;
  message: string;
}

interface WhatsAppService {
  sendMessage(
    request: SendMessageRequest,
    metadata?: Metadata
  ): Observable<SendMessageResponse>;
}

@Injectable()
export class WhatsappService implements OnModuleInit {
  private service: WhatsAppService;

  constructor(@Inject('WHATSAPP_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.service = this.client.getService<WhatsAppService>('WhatsAppService');
  }

  sendMessage(mobileNumber: string, message: string): Observable<SendMessageResponse> {
    const metadata = new Metadata();
    metadata.set('x-password', process.env.WHATSAPP_API_PASSWORD || '');

    return this.service.sendMessage({ mobileNumber, message }, metadata);
  }

}
