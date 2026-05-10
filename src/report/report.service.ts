import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StrategicDeliverable, DeliverableCategory } from '../deliverables/entities/strategic-deliverable.entity';
import { PerformanceBondKPI } from '../performance/entities/performance-bond-kpi.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(StrategicDeliverable)
    private readonly deliverableRepo: Repository<StrategicDeliverable>,
    @InjectRepository(PerformanceBondKPI)
    private readonly kpiRepo: Repository<PerformanceBondKPI>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getPerformanceReport(year: string = '2024') {
    // Fetch Summary Metrics
    const adminCount = await this.userRepo.count({ where: { role: Role.admin } });
    const guestCount = await this.userRepo.count({ where: { role: Role.guest } });
    const presidentialCount = await this.deliverableRepo.count({ where: { category: DeliverableCategory.PRESIDENTIAL_PRIORITY } });
    const ministerialCount = await this.kpiRepo.count();
    const agencyCount = await this.deliverableRepo.count({ where: { category: DeliverableCategory.AGENCY } });

    const summary_metrics = {
      totalUsers: {
        admin: adminCount,
        guest: guestCount,
        total: adminCount + guestCount
      },
      totalPresidentialPriorities: presidentialCount,
      totalMinisterialDeliverables: ministerialCount,
      totalAgencyKPIs: agencyCount
    };

    // Fetch Presidential Priorities
    const presidentialPriorities = await this.deliverableRepo.find({
      where: { category: DeliverableCategory.PRESIDENTIAL_PRIORITY },
    });

    // Fetch Ministerial Deliverables
    const ministerialDeliverables = await this.kpiRepo.find();

    // Group by Priority Area
    const grouped = new Map<string, any>();

    // Process Presidential Priorities
    presidentialPriorities.forEach(d => {
      const area = d.priorityArea || 'General';
      if (!grouped.has(area)) {
        grouped.set(area, { priority_area: area, deliverables: new Map<string, any>() });
      }

      const areaObj = grouped.get(area);
      const delName = d.deliverable;
      if (!areaObj.deliverables.has(delName)) {
        areaObj.deliverables.set(delName, { deliverable_name: delName, metrics: [] });
      }

      const delObj = areaObj.deliverables.get(delName);
      
      const performance = d.yearlyPerformance?.[year] || {};
      
      delObj.metrics.push({
        id: d.id,
        indicator: d.indicator,
        baseline_2023: d.baseline2023 || 0,
        [`quarterly_actuals_${year}`]: performance,
        [`annual_${year}`]: performance.annual || { target: 0, actual: 0 },
        projections: d.projections || {},
        source_of_evidence: d.supportingEvidence
      });
    });

    // Process Ministerial Deliverables
    ministerialDeliverables.forEach(k => {
      const area = k.priorityArea || 'General';
      if (!grouped.has(area)) {
        grouped.set(area, { priority_area: area, deliverables: new Map<string, any>() });
      }

      const areaObj = grouped.get(area);
      const delName = k.deliverable;
      if (!areaObj.deliverables.has(delName)) {
        areaObj.deliverables.set(delName, { deliverable_name: delName, metrics: [] });
      }

      const delObj = areaObj.deliverables.get(delName);
      
      const performance = k.yearlyPerformance?.[year] || {};

      delObj.metrics.push({
        id: k.id,
        indicator: k.indicator,
        baseline_2023: k.baseline2023 || 0,
        [`quarterly_actuals_${year}`]: performance,
        [`annual_${year}`]: performance.annual || { target: 0, actual: 0 },
        projections: k.projections || {},
        source_of_evidence: k.sourceOfEvidence
      });
    });

    return {
      summary_metrics,
      performance_report: Array.from(grouped.values()).map(area => ({
        ...area,
        deliverables: Array.from(area.deliverables.values())
      }))
    };
  }
}
