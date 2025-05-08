import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'The identifier (email or mobile) to verify',
    example: 'kallnaorz2@gmail.com or 963936961320'
  })
  //@IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Identifier is required' })
  identifier: string;

  @ApiProperty({
    description: 'The OTP code sent to the email',
    example: '12345'
  })
  @IsString({ message: 'OTP must be a string' })
  @Length(5, 5, { message: 'OTP must be exactly 5 characters' })
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
} 
