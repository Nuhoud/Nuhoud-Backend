import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'ID of the employer who posted the job',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  employerId: string;

  @ApiProperty({
    description: 'Name of the company offering the job',
    example: 'Tech Solutions Inc.',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: 'Current status of the application',
    enum: ['active', 'closed', 'expired', 'draft'],
    example: 'active',
    default: 'active',
  })
  @IsEnum(['active', 'closed', 'expired', 'draft'])
  status: string;
}