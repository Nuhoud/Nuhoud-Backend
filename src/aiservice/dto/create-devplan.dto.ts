import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, ValidateNested, IsOptional, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

// Job DTO
export class JobDto {
  @ApiProperty({ description: 'Job ID', example: '12345' })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: 'Employer ID', example: '12345' })
  @IsString()
  @IsNotEmpty()
  employerId: string;

  @ApiProperty({ description: 'Job title', example: 'Digital Marketing Specialist' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Company name', example: 'Example Company GmbH', required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ description: 'Match reason', example: 'This role aligns perfectly with your background...' })
  @IsString()
  @IsNotEmpty()
  match: string;

  @ApiProperty({ description: 'Match score (0-100)', example: 95, minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  matchScore: number;
}

// Task DTO
export class TaskDto {
  @ApiProperty({ description: 'Week number', example: 1 })
  @IsNumber()
  week: number;

  @ApiProperty({ description: 'Array of tasks for this week', example: ['Learn advanced SEO techniques', 'Start Google Ads certification'] })
  @IsArray()
  @IsString({ each: true })
  tasks: string[];
}

// Month DTO
export class MonthDto {
  @ApiProperty({ description: 'Month title', example: 'Month 1: Foundation (أساسيات)' })
  @IsString()
  @IsNotEmpty()
  month: string;

  @ApiProperty({ description: 'Tasks for this month', type: [TaskDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];
}

// Step1 DTO
export class Step1Dto {
  @ApiProperty({ description: 'Recommended jobs', type: [JobDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JobDto)
  jobs: JobDto[];
}

// Step2 DTO
export class Step2Dto {
  @ApiProperty({ description: 'Monthly development plan', type: [MonthDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonthDto)
  months: MonthDto[];
}

// Main DTO for creating development plan
export class CreateDevplanDto {
  @ApiProperty({ description: 'Step 1: Recommended jobs', type: Step1Dto })
  @ValidateNested()
  @Type(() => Step1Dto)
  step1: Step1Dto;

  @ApiProperty({ description: 'Step 2: Monthly development plan', type: Step2Dto })
  @ValidateNested()
  @Type(() => Step2Dto)
  step2: Step2Dto;
} 