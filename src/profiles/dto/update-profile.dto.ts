import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsDateString, 
  IsEnum, 
  IsNumber, 
  Min, 
  Max, 
  ValidateNested,
  ArrayMinSize,
  Length,
  IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// Basic Info Update DTO
export class UpdateBasicInfoDto {
  @ApiProperty({ 
    enum: ['ذكر', 'أنثى'],
    example: 'ذكر',
    required: false
  })
  @IsOptional()
  @IsEnum(['ذكر', 'أنثى'])
  gender?: string;

  @ApiProperty({ 
    example: '2002-02-08',
    description: 'Date of birth in YYYY-MM-DD format',
    required: false
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ 
    example: 'keswa, Damascus',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  location?: string;

  @ApiProperty({ 
    example: ['Arabic', 'English', 'Turkish'],
    description: 'Array of languages the user speaks',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  languages?: string[];
}

// Education Update DTO
export class UpdateEducationDto {
  @ApiProperty({ 
    example: "Bachelor's Degree",
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  degree?: string;

  @ApiProperty({ 
    example: 'Computer Science',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  field?: string;

  @ApiProperty({ 
    example: 'Yarmok Private University',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  university?: string;

  @ApiProperty({ 
    example: 2026,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1970)
  @Max(new Date().getFullYear() + 10)
  endYear?: number;

  @ApiProperty({ 
    example: 3.5,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(4)
  GPA?: number;
}

// Work Experience Update DTO
export class UpdateExperienceDto {
  @ApiProperty({ 
    example: 'Backend Developer',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  jobTitle?: string;

  @ApiProperty({ 
    example: 'Tech Solutions GmbH',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  company?: string;

  @ApiProperty({ 
    example: 'Aleppo, Syria', 
    required: false 
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ 
    example: '2022-01-01',
    description: 'Start date in YYYY-MM-DD format',
    required: false
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ 
    example: true, 
    required: false 
  })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiProperty({ 
    example: '2023-06-30',
    description: 'End date in YYYY-MM-DD format',
    required: false
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ 
    example: 'Developed RESTful APIs and integrated MongoDB using Node.js and Express.',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;
}

// Certifications Update DTO
export class UpdateCertificationDto {
  @ApiProperty({ 
    example: 'AWS Certified Cloud Practitioner',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  name?: string;

  @ApiProperty({ 
    example: 'Amazon',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  issuer?: string;

  @ApiProperty({ 
    example: '2023-01-15',
    description: 'Issue date in YYYY-MM-DD format',
    required: false
  })
  @IsOptional()
  @IsDateString()
  issueDate?: string;
}

// Job Preferences Update DTO
export class UpdateJobPreferencesDto {
  @ApiProperty({ 
    enum: ['عن بعد', 'في الشركة','مزيج'],
    example: ['عن بعد', 'في الشركة'],
    isArray: true,
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsEnum(['عن بعد', 'في الشركة','مزيج'], { each: true })
  workPlaceType?: string[];

  @ApiProperty({ 
    enum: ['دوام كامل', 'دوام جزئي', 'عقد', 'مستقل', 'تدريب'],
    example: ['مستقل', 'دوام كامل'],
    isArray: true,
    required: false
  })
  @IsOptional()
  @IsArray()
  @IsEnum(['دوام كامل', 'دوام جزئي', 'عقد', 'مستقل', 'تدريب'], { each: true })
  jobType?: string[];

  @ApiProperty({ 
    example: 'Germany',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  jobLocation?: string;
}

// Career Goals Update DTO
export class UpdateGoalsDto {
  @ApiProperty({ 
    example: 'To become a senior AI engineer specializing in NLP and infrastructure automation.',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(10, 1000)
  careerGoal?: string;

  @ApiProperty({ 
    example: ['AI Ethics', 'Open Source Software', 'Tech for Good', 'Cloud Architecture', 'Entrepreneurship'],
    description: 'Areas of interest',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  interests?: string[];
}

// Skills Update DTO
export class UpdateSkillDto {
  @ApiProperty({ 
    example: 'Node.js',
    required: false
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name?: string;

  @ApiProperty({ 
    example: 85,
    minimum: 0,
    maximum: 100,
    description: 'Skill level from 0 to 100',
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  level?: number;
}

export class UpdateSkillsDto {
  @ApiProperty({ 
    type: [UpdateSkillDto],
    description: 'Array of technical skills',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSkillDto)
  technical_skills?: UpdateSkillDto[];

  @ApiProperty({ 
    type: [UpdateSkillDto],
    description: 'Array of soft skills',
    required: false
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSkillDto)
  soft_skills?: UpdateSkillDto[];
}

// Main Update Profile DTO
export class UpdateProfileDto {
  @ApiProperty({ 
    type: UpdateBasicInfoDto,
    required: false
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateBasicInfoDto)
  basicInfo?: UpdateBasicInfoDto;

  @ApiProperty({ 
    type: [UpdateEducationDto],
    required: false
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateEducationDto)
  @IsArray()
  education?: UpdateEducationDto[];

  @ApiProperty({ 
    type: [UpdateExperienceDto], 
    required: false 
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateExperienceDto)
  @IsArray()
  experiences?: UpdateExperienceDto[];

  @ApiProperty({ 
    type: [UpdateCertificationDto], 
    required: false 
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateCertificationDto)
  @IsArray()
  certifications?: UpdateCertificationDto[];

  @ApiProperty({ 
    type: UpdateJobPreferencesDto, 
    required: false 
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateJobPreferencesDto)
  jobPreferences?: UpdateJobPreferencesDto;

  @ApiProperty({ 
    type: UpdateGoalsDto, 
    required: false 
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateGoalsDto)
  goals?: UpdateGoalsDto;

  @ApiProperty({ 
    type: UpdateSkillsDto, 
    required: false 
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSkillsDto)
  skills?: UpdateSkillsDto;
}