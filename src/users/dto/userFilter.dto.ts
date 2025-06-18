import { IsOptional, IsString, IsNumber, IsArray, IsEnum, IsMongoId, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional,ApiProperty } from '@nestjs/swagger';



export class UserFiltersDto {

  @ApiProperty({ 
    description: 'filter by user role',
    enum: ['user', 'employer','admin'],
    example: 'user'
  })
  @IsEnum(['user', 'employer','admin'])
  role?: string;
  
}
