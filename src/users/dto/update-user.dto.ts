import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'kallnaorz2@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;

  @ApiProperty({
    description: 'The mobile of the user',
    example: '963936961320',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mobile number must be a string' })
  @MinLength(12, { message: 'Mobile number must be 12 characters long' })
  @MaxLength(12, { message: 'Mobile number must be 12 characters long' })
  mobile?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'pass1234',
    required: false,
    minLength: 8,
  })
  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiProperty({
    description: 'Whether the user email is verified',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isVerified must be a boolean value (true/false)' })
  isVerified?: boolean;
}
