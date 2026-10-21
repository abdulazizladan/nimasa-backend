import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PerformanceService } from './performance.service';
import { DepartmentPerformanceController } from './performance.controller';
import { DepartmentMonthlyPerformance } from './entities/department-performance.entity';
import { PerformanceBondKPI } from './entities/performance-bond-kpi.entity';
import { Department } from '../organization/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        DepartmentMonthlyPerformance, 
        PerformanceBondKPI,
        Department
      ]
    )
  ],
  providers: [PerformanceService],
  controllers: [DepartmentPerformanceController],
})
export class PerformanceModule {}
