import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Department } from './entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization, Department])
  ],
  providers: [OrganizationService],
  controllers: [OrganizationController]
})
export class OrganizationModule {}
