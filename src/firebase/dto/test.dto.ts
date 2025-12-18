import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class TestFcmDto {
  @ApiProperty({ example: 'Test Notification', description: 'Notification title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Firebase push is working!', description: 'Notification body' })
  @IsString()
  body: string;

  @ApiPropertyOptional({
    example: { type: 'TEST', screen: 'home' },
    description: 'Custom key-value data payload (strings only)',
    type: Object,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
