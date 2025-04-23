import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { WhatsAppMessageDto } from './dto/whatsapp-message.dto';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class WhatsAppService {
  private readonly apiUrl: string;
  private readonly apiPassword: string;

  constructor(
    private readonly httpService: HttpService,
  ) {
    this.apiUrl =  process.env.WHATSAPP_API_URL || 'http://localhost:8080';
    this.apiPassword =  process.env.WHATSAPP_API_PASSWORD || '20022002';
  }

  async sendWhatsAppMessage(messageData: WhatsAppMessageDto): Promise<any> {
    try {
      // validation
      if (!messageData.phone || !messageData.message) {
        throw new HttpException(
          'missing phone number or message',
          HttpStatus.BAD_REQUEST,
        );
      }

      // send message
      const response = await lastValueFrom(
        this.httpService.post(
          `${this.apiUrl}/whatsapp/sendmessage`,
          {
            phone: messageData.phone,
            message: messageData.message,
          },
          {
            headers: {
              'x-password': this.apiPassword,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      // return result
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.message);
      
      // return error message
      throw new HttpException('Failed to send OTO via WhatsApp message',HttpStatus.INTERNAL_SERVER_ERROR,);
    }
  }
}
