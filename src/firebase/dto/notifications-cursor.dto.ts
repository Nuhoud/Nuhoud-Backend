import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class NotificationsCursorDto {
  @ApiPropertyOptional({
    description: 'Opaque cursor representing the createdAt of the last item from the previous page (ISO date).',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    description: 'Number of notifications to return (cursor-based).',
    minimum: 1,
    maximum: 50,
    default: 3,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number = 3;
}
