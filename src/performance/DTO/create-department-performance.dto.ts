import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateDepartmentPerformanceDto {
  @ApiProperty({ description: 'UUID of the department', example: 'uuid-of-department' })
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty({ description: 'Calendar year for the performance record', example: 2024 })
  @IsInt()
  year: number;

  @ApiProperty({ description: 'Calendar month (1-12)', example: 3, minimum: 1, maximum: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ description: 'Overall performance score for the month (0-100)', example: 85.5, required: false })
  @IsOptional()
  performanceScore?: number;

  @ApiProperty({ description: 'Total number of performance targets for the month', example: 20, required: false })
  @IsOptional()
  totalTargets?: number;

  @ApiProperty({ description: 'Number of completed targets for the month', example: 15, required: false })
  @IsOptional()
  completedTargets?: number;

  @ApiProperty({ description: 'Number of pending targets for the month', example: 3, required: false })
  @IsOptional()
  pendingTargets?: number;

  @ApiProperty({ description: 'Number of overdue targets for the month', example: 2, required: false })
  @IsOptional()
  overdueTargets?: number;

  @ApiProperty({ description: 'Optional notes or commentary for the monthly performance', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
