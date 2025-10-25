import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Department } from './entities/department.entity';
import { PriorityArea } from './entities/priority-area.entity';
import { Deliverable } from './entities/deliverable.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        Organization, 
        Department,
        PriorityArea,
        Deliverable
      ]
    )
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController]
})
export class OrganizationModule {}  
