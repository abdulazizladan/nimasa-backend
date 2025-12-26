import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class MonthlySummaryItemDto {
  @ApiProperty({ description: 'Calendar year for the summary record', example: 2024 })
  year: number;

  @ApiProperty({ description: 'Calendar month (1-12)', example: 3 })
  month: number;

  @ApiProperty({ description: 'Total number of performance targets for the month', example: 20 })
  totalTargets: number;

  @ApiProperty({ description: 'Number of completed targets for the month', example: 15 })
  completedTargets: number;

  @ApiProperty({ description: 'Number of outstanding (pending) targets for the month', example: 3 })
  outstandingTargets: number;

  @ApiProperty({ description: 'Number of unmet (overdue) targets for the month', example: 2 })
  unmetTargets: number;
}

export class DepartmentMonthlySummaryDto {
  @ApiProperty({ description: 'UUID of the department the summary is for' })
  departmentId: string;

  @ApiPropertyOptional({
    description: 'Summary for the current month, if a performance record exists. If missing, all values are 0.',
    type: MonthlySummaryItemDto,
  })
  currentMonth?: MonthlySummaryItemDto;

  @ApiPropertyOptional({
    description: 'Summary for the immediate previous month, if a performance record exists. If missing, all values are 0.',
    type: MonthlySummaryItemDto,
  })
  previousMonth?: MonthlySummaryItemDto;
}







