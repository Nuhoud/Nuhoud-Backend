import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class resultUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}