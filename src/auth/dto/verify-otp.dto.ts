import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'The email address to verify',
    example: 'user@example.com'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'The OTP code sent to the email',
    example: '123456'
  })
  @IsString({ message: 'OTP must be a string' })
  @Length(5, 5, { message: 'OTP must be exactly 5 characters' })
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;
}
