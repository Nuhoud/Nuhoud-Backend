import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
    required: true
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'pass123',
    required: true,
    minLength: 8
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}