import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverablesService } from './deliverables.service';
import { AgencyDeliverablesController } from './deliverables.controller';
import { PresidentialPrioritiesController, MinisterialDeliverablesController } from './category-deliverables.controller';
import { QuarterlyReportsController } from './quarterly-reports.controller';
import { StrategicDeliverable } from './entities/strategic-deliverable.entity';
import { DeliverableSubmission } from './entities/deliverable-submission.entity';
import { PresidentialPriorityArea } from './entities/presidential-priority.entity';
import { PerformanceBondKPI } from '../performance/entities/performance-bond-kpi.entity';
import { DeliverablesStartupService } from './deliverables-startup.service';

@Module({
    imports: [TypeOrmModule.forFeature([StrategicDeliverable, DeliverableSubmission, PresidentialPriorityArea, PerformanceBondKPI])],
    controllers: [
        AgencyDeliverablesController, PresidentialPrioritiesController, MinisterialDeliverablesController, QuarterlyReportsController
    ],
    providers: [DeliverablesService, DeliverablesStartupService],
    exports: [DeliverablesService],
})
export class DeliverablesModule { }
