import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverablesService } from './deliverables.service';
import { DeliverablesController } from './deliverables.controller';
import { Deliverable } from './entities/deliverable.entity';
import { MonthlySubmission } from './entities/monthly-submission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Deliverable, MonthlySubmission])],
    controllers: [DeliverablesController],
    providers: [DeliverablesService],
    exports: [DeliverablesService],
})
export class DeliverablesModule { }
