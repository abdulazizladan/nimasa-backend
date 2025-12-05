import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PerformanceService } from './performance.service';
import { CreateDepartmentPerformanceDto } from './DTO/create-department-performance.dto';
import { UpdateDepartmentPerformanceDto } from './DTO/update-department-performance.dto';
import { QueryDepartmentPerformanceDto } from './DTO/query-department-performance.dto';
import { DepartmentMonthlyPerformance } from './entities/department-performance.entity';
import { DepartmentMonthlySummaryDto } from './DTO/department-monthly-summary.dto';

@ApiTags('Department Performance')
@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post('department-monthly')
  @ApiOperation({ summary: 'Create or update monthly performance for a department' })
  @ApiBody({ type: CreateDepartmentPerformanceDto })
  @ApiResponse({
    status: 201,
    description: 'Monthly performance record created or updated.',
    type: DepartmentMonthlyPerformance,
  })
  createOrUpdateMonthlyPerformance(
    @Body() dto: CreateDepartmentPerformanceDto,
  ): Promise<DepartmentMonthlyPerformance> {
    return this.performanceService.recordDepartmentMonthlyPerformance(dto);
  }

  @Patch('department-monthly/:id')
  @ApiOperation({ summary: 'Update a specific department monthly performance record' })
  @ApiParam({ name: 'id', description: 'UUID of the performance record' })
  @ApiBody({ type: UpdateDepartmentPerformanceDto })
  @ApiResponse({ status: 200, description: 'Updated performance record.', type: DepartmentMonthlyPerformance })
  updateMonthlyPerformance(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDepartmentPerformanceDto,
  ): Promise<DepartmentMonthlyPerformance> {
    return this.performanceService.updateDepartmentMonthlyPerformance(id, dto);
  }

  @Get('department/:departmentId/current')
  @ApiOperation({ summary: "Get the most recent performance record for a department" })
  @ApiParam({ name: 'departmentId', description: 'UUID of the department' })
  @ApiResponse({
    status: 200,
    description: 'Most recent monthly performance record for the department.',
    type: DepartmentMonthlyPerformance,
  })
  getCurrentDepartmentPerformance(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<DepartmentMonthlyPerformance | null> {
    return this.performanceService.getCurrentDepartmentPerformance(departmentId);
  }

  @Get('department/:departmentId/history')
  @ApiOperation({ summary: 'Get historical performance records for a department' })
  @ApiParam({ name: 'departmentId', description: 'UUID of the department' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'month', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'List of historical monthly performance records for the department.',
    type: [DepartmentMonthlyPerformance],
  })
  getDepartmentPerformanceHistory(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Query() query: QueryDepartmentPerformanceDto,
  ): Promise<DepartmentMonthlyPerformance[]> {
    return this.performanceService.getDepartmentPerformanceHistory(departmentId, query);
  }

  @Get('department/:departmentId/summary')
  @ApiOperation({
    summary: 'Get a summary of performance targets for the current and previous month for a department',
  })
  @ApiParam({ name: 'departmentId', description: 'UUID of the department' })
  @ApiResponse({
    status: 200,
    description:
      'Summary including total, completed, outstanding (pending), and unmet (overdue) targets for the current and immediate previous month.',
    type: DepartmentMonthlySummaryDto,
  })
  getDepartmentMonthlySummary(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
  ): Promise<DepartmentMonthlySummaryDto> {
    return this.performanceService.getDepartmentMonthlySummary(departmentId);
  }
}
