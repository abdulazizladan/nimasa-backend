import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentMonthlyPerformance } from './entities/department-performance.entity';
import { Department } from '../organization/entities/department.entity';
import { CreateDepartmentPerformanceDto } from './DTO/create-department-performance.dto';
import { UpdateDepartmentPerformanceDto } from './DTO/update-department-performance.dto';
import { QueryDepartmentPerformanceDto } from './DTO/query-department-performance.dto';
import { DepartmentMonthlySummaryDto } from './DTO/department-monthly-summary.dto';

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(DepartmentMonthlyPerformance)
    private readonly departmentPerformanceRepo: Repository<DepartmentMonthlyPerformance>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  private async getDepartmentOrThrow(id: string): Promise<Department> {
    const department = await this.departmentRepo.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found.`);
    }
    return department;
  }

  async recordDepartmentMonthlyPerformance(
    dto: CreateDepartmentPerformanceDto,
  ): Promise<DepartmentMonthlyPerformance> {
    const department = await this.getDepartmentOrThrow(dto.departmentId);

    // Check if a record for this department/year/month already exists
    let record = await this.departmentPerformanceRepo.findOne({
      where: { department: { id: department.id }, year: dto.year, month: dto.month },
      relations: ['department'],
    });

    if (record) {
      // Update existing record
      Object.assign(record, {
        performanceScore: dto.performanceScore ?? record.performanceScore,
        totalTargets: dto.totalTargets ?? record.totalTargets,
        completedTargets: dto.completedTargets ?? record.completedTargets,
        pendingTargets: dto.pendingTargets ?? record.pendingTargets,
        overdueTargets: dto.overdueTargets ?? record.overdueTargets,
        notes: dto.notes ?? record.notes,
      });
    } else {
      record = this.departmentPerformanceRepo.create({
        department,
        year: dto.year,
        month: dto.month,
        performanceScore: dto.performanceScore ?? 0,
        totalTargets: dto.totalTargets ?? 0,
        completedTargets: dto.completedTargets ?? 0,
        pendingTargets: dto.pendingTargets ?? 0,
        overdueTargets: dto.overdueTargets ?? 0,
        notes: dto.notes,
      });
    }

    return this.departmentPerformanceRepo.save(record);
  }

  async updateDepartmentMonthlyPerformance(
    id: string,
    dto: UpdateDepartmentPerformanceDto,
  ): Promise<DepartmentMonthlyPerformance> {
    const record = await this.departmentPerformanceRepo.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!record) {
      throw new NotFoundException(`Department performance record with ID "${id}" not found.`);
    }

    Object.assign(record, dto);
    return this.departmentPerformanceRepo.save(record);
  }

  async getCurrentDepartmentPerformance(
    departmentId: string,
  ): Promise<DepartmentMonthlyPerformance | null> {
    await this.getDepartmentOrThrow(departmentId);

    return this.departmentPerformanceRepo.findOne({
      where: { department: { id: departmentId } },
      order: { year: 'DESC', month: 'DESC' },
      relations: ['department'],
    });
  }

  async getDepartmentPerformanceHistory(
    departmentId: string,
    query: QueryDepartmentPerformanceDto,
  ): Promise<DepartmentMonthlyPerformance[]> {
    await this.getDepartmentOrThrow(departmentId);

    const qb = this.departmentPerformanceRepo
      .createQueryBuilder('perf')
      .leftJoinAndSelect('perf.department', 'department')
      .where('department.id = :departmentId', { departmentId });

    if (query.year) {
      qb.andWhere('perf.year = :year', { year: query.year });
    }
    if (query.month) {
      qb.andWhere('perf.month = :month', { month: query.month });
    }

    qb.orderBy('perf.year', 'DESC').addOrderBy('perf.month', 'DESC');

    if (query.limit) {
      qb.limit(query.limit);
    }

    return qb.getMany();
  }

  async getDepartmentMonthlySummary(
    departmentId: string,
  ): Promise<DepartmentMonthlySummaryDto> {
    await this.getDepartmentOrThrow(departmentId);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JS months are 0-based

    const previousMonthDate = new Date(currentYear, currentMonth - 2, 1); // subtract 1 month
    const previousYear = previousMonthDate.getFullYear();
    const previousMonth = previousMonthDate.getMonth() + 1;

    const [currentRecord, previousRecord] = await Promise.all([
      this.departmentPerformanceRepo.findOne({
        where: { department: { id: departmentId }, year: currentYear, month: currentMonth },
      }),
      this.departmentPerformanceRepo.findOne({
        where: { department: { id: departmentId }, year: previousYear, month: previousMonth },
      }),
    ]);

    const buildSummaryItem = (year: number, month: number, record?: DepartmentMonthlyPerformance) => ({
      year,
      month,
      totalTargets: record?.totalTargets ?? 0,
      completedTargets: record?.completedTargets ?? 0,
      outstandingTargets: record?.pendingTargets ?? 0,
      unmetTargets: record?.overdueTargets ?? 0,
    });

    return {
      departmentId,
      currentMonth: buildSummaryItem(currentYear, currentMonth, currentRecord ?? undefined),
      previousMonth: buildSummaryItem(previousYear, previousMonth, previousRecord ?? undefined),
    };
  }
}
