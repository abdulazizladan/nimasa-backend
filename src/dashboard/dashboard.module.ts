import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User } from '../user/entities/user.entity';
import { PresidentialPriorityArea } from '../deliverables/entities/presidential-priority.entity';
import { StrategicDeliverable } from '../deliverables/entities/strategic-deliverable.entity';
import { KPI } from '../organization/entities/kpi.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PresidentialPriorityArea,
      StrategicDeliverable,
      KPI
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
