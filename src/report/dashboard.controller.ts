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
    return this.reportService.getPerformanceReport(year);
  }
}
