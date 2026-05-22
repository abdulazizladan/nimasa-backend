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
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PerformanceService } from './performance.service';
import { CreateDepartmentPerformanceDto } from './DTO/create-department-performance.dto';
import { UpdateDepartmentPerformanceDto } from './DTO/update-department-performance.dto';
import { QueryDepartmentPerformanceDto } from './DTO/query-department-performance.dto';
import { DepartmentMonthlyPerformance } from './entities/department-performance.entity';
import { DepartmentMonthlySummaryDto } from './DTO/department-monthly-summary.dto';
import { PerformanceBondKPI } from './entities/performance-bond-kpi.entity';
import { CreatePerformanceBondKpiDto, UpdatePerformanceBondKpiDto } from './DTO/performance-bond-kpi.dto';

@ApiTags('Ministerial Deliverables')
@Controller('ministerial-deliverables')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MinisterialDeliverablesController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Post('department-monthly')
  @Roles(Role.admin, Role.director, Role.manager)
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
  @Roles(Role.admin, Role.director, Role.manager)
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
  @Roles(Role.admin, Role.director, Role.manager, Role.guest)
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
  @Roles(Role.admin, Role.director, Role.manager, Role.guest)
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
  @Roles(Role.admin, Role.director, Role.manager, Role.guest)
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

  // Ministerial Deliverable CRUD Endpoints
  @Get('deliverables')
  @Roles(Role.admin, Role.director, Role.manager, Role.guest)
  @ApiOperation({ summary: 'List all ministerial deliverables' })
  @ApiResponse({ status: 200, type: [PerformanceBondKPI] })
  findAll(): Promise<PerformanceBondKPI[]> {
    return this.performanceService.findAllKPIs();
  }

  @Get('deliverables/:id')
  @Roles(Role.admin, Role.director, Role.manager, Role.guest)
  @ApiOperation({ summary: 'Get a specific ministerial deliverable' })
  @ApiParam({ name: 'id', description: 'Deliverable ID' })
  @ApiResponse({ status: 200, type: PerformanceBondKPI })
  findOne(@Param('id') id: string): Promise<PerformanceBondKPI> {
    return this.performanceService.findOneKPI(id);
  }

  @Post('deliverables')
  @Roles(Role.admin, Role.director, Role.manager)
  @ApiOperation({ summary: 'Create a new ministerial deliverable' })
  @ApiBody({ type: CreatePerformanceBondKpiDto })
  @ApiResponse({ status: 201, type: PerformanceBondKPI })
  create(@Body() dto: CreatePerformanceBondKpiDto): Promise<PerformanceBondKPI> {
    return this.performanceService.createKPI(dto);
  }

  @Patch('deliverables/:id')
  @Roles(Role.admin, Role.director, Role.manager)
  @ApiOperation({ summary: 'Update an existing ministerial deliverable' })
  @ApiParam({ name: 'id', description: 'Deliverable ID' })
  @ApiBody({ type: UpdatePerformanceBondKpiDto })
  @ApiResponse({ status: 200, type: PerformanceBondKPI })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePerformanceBondKpiDto,
  ): Promise<PerformanceBondKPI> {
    return this.performanceService.updateKPI(id, dto);
  }

  @Delete('deliverables/:id')
  @Roles(Role.admin, Role.director, Role.manager)
  @ApiOperation({ summary: 'Delete a ministerial deliverable' })
  @ApiParam({ name: 'id', description: 'Deliverable ID' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string): Promise<void> {
    return this.performanceService.removeKPI(id);
  }
}
