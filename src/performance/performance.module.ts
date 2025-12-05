import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceService } from './performance.service';
import { PerformanceController } from './performance.controller';
import { DepartmentMonthlyPerformance } from './entities/department-performance.entity';
import { Department } from '../organization/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        DepartmentMonthlyPerformance, 
        Department
      ]
    )
  ],
  providers: [PerformanceService],
  controllers: [PerformanceController],
})
export class PerformanceModule {}
