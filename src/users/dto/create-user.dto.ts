import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
    required: false,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email?: string;

  @ApiProperty({
    description: 'The mobile of the user',
    example: '123456789012',
    required: false,
  })
  @IsString({ message: 'Mobile number must be a string' })
  @IsNotEmpty({ message: 'Mobile number is required' })
  @MaxLength(12, { message: 'Mobile number must be 12 characters long' })
  @MinLength(12, { message: 'Mobile number must be 12 characters long' })
  mobile?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'pass1234',
    required: true,
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
