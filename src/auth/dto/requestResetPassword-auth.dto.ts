import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestResetPasswordDto {
  @ApiProperty({
    description: 'The identifier (email or mobile) to reset password for',
    example: 'kallnaorz2@gmail.com or 963936961320'
  })
  @IsNotEmpty({ message: 'Identifier is required' })
  identifier: string;
}