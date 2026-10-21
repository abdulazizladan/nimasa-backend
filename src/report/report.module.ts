import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { DashboardController } from './dashboard.controller';
import { ReportService } from './report.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategicDeliverable } from '../deliverables/entities/strategic-deliverable.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StrategicDeliverable, User])
  ],
  controllers: [ReportController, DashboardController],
  providers: [ReportService]
})
export class ReportModule {}
