import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({
    description: 'The email or mobile to send OTP to',
    example: 'kallnaorz2@gmail.com or 963936961320'
  })
  @IsNotEmpty({ message: 'identifier is required' })
  identifier: string;
}
