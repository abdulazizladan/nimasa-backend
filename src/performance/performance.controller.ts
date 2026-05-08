import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PerformanceService } from './performance.service';
import { CreateDepartmentPerformanceDto } from './DTO/create-department-performance.dto';
import { UpdateDepartmentPerformanceDto } from './DTO/update-department-performance.dto';
import { QueryDepartmentPerformanceDto } from './DTO/query-department-performance.dto';
import { DepartmentMonthlyPerformance } from './entities/department-performance.entity';
import { DepartmentMonthlySummaryDto } from './DTO/department-monthly-summary.dto';
import { PerformanceBondKPI } from './entities/performance-bond-kpi.entity';
import { CreatePerformanceBondKpiDto, UpdatePerformanceBondKpiDto } from './DTO/performance-bond-kpi.dto';

@ApiTags('Department Performance')
@Controller('performance-bond-deliverables')
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

  // Performance Bond KPI CRUD Endpoints
  @Get('kpis')
  @ApiOperation({ summary: 'List all performance bond KPIs' })
  @ApiResponse({ status: 200, type: [PerformanceBondKPI] })
  findAllKPIs(): Promise<PerformanceBondKPI[]> {
    return this.performanceService.findAllKPIs();
  }

  @Get('kpis/:id')
  @ApiOperation({ summary: 'Get a specific performance bond KPI' })
  @ApiParam({ name: 'id', description: 'KPI ID' })
  @ApiResponse({ status: 200, type: PerformanceBondKPI })
  findOneKPI(@Param('id') id: string): Promise<PerformanceBondKPI> {
    return this.performanceService.findOneKPI(id);
  }

  @Post('kpis')
  @ApiOperation({ summary: 'Create a new performance bond KPI' })
  @ApiBody({ type: CreatePerformanceBondKpiDto })
  @ApiResponse({ status: 201, type: PerformanceBondKPI })
  createKPI(@Body() dto: CreatePerformanceBondKpiDto): Promise<PerformanceBondKPI> {
    return this.performanceService.createKPI(dto);
  }

  @Patch('kpis/:id')
  @ApiOperation({ summary: 'Update an existing performance bond KPI' })
  @ApiParam({ name: 'id', description: 'KPI ID' })
  @ApiBody({ type: UpdatePerformanceBondKpiDto })
  @ApiResponse({ status: 200, type: PerformanceBondKPI })
  updateKPI(
    @Param('id') id: string,
    @Body() dto: UpdatePerformanceBondKpiDto,
  ): Promise<PerformanceBondKPI> {
    return this.performanceService.updateKPI(id, dto);
  }

  @Delete('kpis/:id')
  @ApiOperation({ summary: 'Delete a performance bond KPI' })
  @ApiParam({ name: 'id', description: 'KPI ID' })
  @ApiResponse({ status: 204 })
  removeKPI(@Param('id') id: string): Promise<void> {
    return this.performanceService.removeKPI(id);
  }
}
