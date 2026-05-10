import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverablesService } from './deliverables.service';
import { DeliverablesController } from './deliverables.controller';
import { PresidentialPrioritiesController } from './high-impact-deliverables.controller';
import { QuarterlyReportsController } from './quarterly-reports.controller';
import { StrategicDeliverable } from './entities/strategic-deliverable.entity';
import { DeliverableSubmission } from './entities/deliverable-submission.entity';
import { PresidentialPriorityArea } from './entities/presidential-priority.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StrategicDeliverable, DeliverableSubmission, PresidentialPriorityArea])],
    controllers: [DeliverablesController, PresidentialPrioritiesController, QuarterlyReportsController],
    providers: [DeliverablesService],
    exports: [DeliverablesService],
})
export class DeliverablesModule { }
