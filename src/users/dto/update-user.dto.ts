import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    
    @ApiProperty({
        description: 'The name of the user',
        example: 'John Doe',
        required: false
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'The email of the user',
        example: 'test3@test.com',
        required: false
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'pass321',
        required: false,
        minLength: 8
    })
    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;
}