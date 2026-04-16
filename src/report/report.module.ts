import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { DashboardController } from './dashboard.controller';
import { ReportService } from './report.service';

@Module({
  controllers: [ReportController, DashboardController],
  providers: [ReportService]
})
export class ReportModule {}
