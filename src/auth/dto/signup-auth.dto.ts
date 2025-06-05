import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsUrl,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SignupDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({
    description: 'The email or mobile of the user',
    example: 'kallnaorz2@gmail.com or 963936961320',
    required: true,
  })
  @IsNotEmpty({ message: 'Identifier is required' })
  @IsString({ message: 'Identifier must be a string' })
  identifier: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'pass123',
    required: true,
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}

export class CompanyDto {
  @ApiProperty({
    description: 'The name of the company',
    example: 'Tech Corp',
    required: true,
  })
  @IsNotEmpty({ message: 'Company name is required' })
  @IsString({ message: 'Company name must be a string' })
  @MaxLength(100, { message: 'Company name must not exceed 100 characters' })
  name: string;

  @ApiProperty({
    description: 'The industry of the company',
    example: 'Software Development',
    required: true,
  })
  @IsNotEmpty({ message: 'Company industry is required' })
  @IsString({ message: 'Company industry must be a string' })
  @MaxLength(50, { message: 'Industry must not exceed 50 characters' })
  industry: string;

  @ApiProperty({
    description: 'The website URL of the company',
    example: 'https://techcorp.com',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Website must be a valid URL' })
  website?: string;

  @ApiProperty({
    description: 'A brief description of the company',
    example: 'Leading provider of AI solutions.',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'The location of the company',
    example: 'Cairo, Egypt',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  @MaxLength(100, { message: 'Location must not exceed 100 characters' })
  location?: string;

  @ApiProperty({
    description: 'The size of the company',
    example: '51-200',
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    required: true,
  })
  @IsNotEmpty({ message: 'Company size is required' })
  @IsEnum(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'], {
    message: 'Company size must be one of: 1-10, 11-50, 51-200, 201-500, 501-1000, 1000+',
  })
  size: string;
}

export class SignupEmployerDto extends SignupDto {
  @ApiProperty({
    description: 'Company information for the employer',
    type: CompanyDto,
    required: true,
  })
  @IsNotEmpty({ message: 'Company information is required for employers' })
  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}
