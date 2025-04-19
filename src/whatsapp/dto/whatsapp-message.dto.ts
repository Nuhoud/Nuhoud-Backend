import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WhatsAppMessageDto {
  @ApiProperty({
    description: 'The phone number of the user',
    example: '963936961320',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The message',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}