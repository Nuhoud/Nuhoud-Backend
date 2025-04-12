import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({description: 'The name of the user'})
  @IsNotEmpty()
  @IsString()
  name: string;


  @ApiProperty({description: 'The email of the user'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({description: 'The password of the user'})
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({description: 'The type of the user'})
  @IsNotEmpty()
  @IsEnum(['admin', 'normal'], { message: 'User type must be either admin or normal' })
  userType: 'admin' | 'normal';
}