import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The identifier (email or mobile) to reset password for',
    example: 'kallnaorz2@gmail.com or 963936961320'
  })
  @IsNotEmpty({ message: 'Identifier is required' })
  identifier: string;

  @ApiProperty({
    description: 'The new password',
    example: 'pass1234'
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  newPassword: string;
}