import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({ example: 'fcm_device_token_here', description: 'FCM device token' })
  @IsString()
  token: string;

  @ApiPropertyOptional({
    example: 'web',
    description: 'Device platform',
    enum: ['web', 'android', 'ios'],
  })
  @IsOptional()
  @IsIn(['web', 'android', 'ios'])
  platform?: 'web' | 'android' | 'ios';
}
