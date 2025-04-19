import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsOptional, IsString, MinLength, IsBoolean, MaxLength } from 'class-validator';

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
        description: 'The mobile of the user',
        example: '963936961320',
        required: false
    })
    @IsOptional()
    @IsString()
    @MinLength(12)
    @MaxLength(12)
    mobile?: string;

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


    @ApiProperty({
        description: 'Whether the user email is verified',
        example: false,
        default: false,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    isVerified?: boolean;

}