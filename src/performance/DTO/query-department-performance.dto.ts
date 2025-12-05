import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class QueryDepartmentPerformanceDto {
  @ApiPropertyOptional({ description: 'Filter by year (e.g., 2024)' })
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiPropertyOptional({ description: 'Filter by month (1-12). If omitted, all months in the year are returned.', minimum: 1, maximum: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @ApiPropertyOptional({ description: 'Limit number of historical records returned', example: 12 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
