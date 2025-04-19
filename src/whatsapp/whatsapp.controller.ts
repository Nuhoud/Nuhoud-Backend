import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppMessageDto } from './dto/whatsapp-message.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/public.decorator';

// foooooooooor tesssssssssssssst
@Controller('messages')
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Public()
  @Post('whatsapp')
  @HttpCode(HttpStatus.OK)
  async sendWhatsAppMessage(@Body() messageData: WhatsAppMessageDto) {
    return this.whatsAppService.sendWhatsAppMessage(messageData);
  }
}
