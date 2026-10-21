import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly reportService: ReportService) {}

  @Roles(Role.admin, Role.guest)
  @Get('performance-report')
  @ApiOperation({ summary: 'Get aggregated dashboard performance report' })
  @ApiQuery({ name: 'year', required: false, type: String })
  getPerformanceReport(@Query('year') year?: string) {
    return this.reportService.getPerformanceReport(year);
  }
}
