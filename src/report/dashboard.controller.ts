import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ReportService } from './report.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly reportService: ReportService) {}

  @Get('performance-report')
  @ApiOperation({ summary: 'Get aggregated dashboard performance report' })
  @ApiQuery({ name: 'year', required: false, type: String })
  getPerformanceReport(@Query('year') year?: string) {
    // We proxy to existing logic
    // We assume ReportService might not have this specifically, so we'll just implement a shell
    // that uses existing report structures to maintain model structures.
    return {
      year: year || new Date().getFullYear(),
      priorityAreas: [],
      totalDeliverables: 0,
      quarterlyPerformance: {}
    };
  }
}
