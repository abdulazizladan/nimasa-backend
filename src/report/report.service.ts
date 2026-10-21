import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { StrategicDeliverable, DeliverableCategory } from '../deliverables/entities/strategic-deliverable.entity';
import { User } from '../user/entities/user.entity';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(StrategicDeliverable)
    private readonly deliverableRepo: Repository<StrategicDeliverable>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getPerformanceReport(year: string = '2024') {
    // Fetch Summary Metrics
    const adminCount = await this.userRepo.count({ where: { role: Role.admin } });
    const guestCount = await this.userRepo.count({ where: { role: Role.guest } });
    const presidentialCount = await this.deliverableRepo.count({ where: { category: In([DeliverableCategory.PRESIDENTIAL_PRIORITY, DeliverableCategory.BOTH]) } });
    const ministerialCount = await this.deliverableRepo.count({ where: { category: In([DeliverableCategory.MINISTERIAL, DeliverableCategory.BOTH]) } });
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

    // Presidential and ministerial deliverables (BOTH counts in each list but is reported once)
    const deliverables = await this.deliverableRepo.find({
      where: {
        category: In([DeliverableCategory.PRESIDENTIAL_PRIORITY, DeliverableCategory.MINISTERIAL, DeliverableCategory.BOTH])
      },
    });

    // Group by Priority Area
    const grouped = new Map<string, any>();

    deliverables.forEach(d => {
      const area = d.priorityArea || 'General';
      if (!grouped.has(area)) {
        grouped.set(area, { priority_area: area, deliverables: new Map<string, any>() });
      }

      const areaObj = grouped.get(area);
      // Ministerial deliverables keep their title in outcome and may have no description
      const delName = d.deliverable || d.outcome;
      if (!areaObj.deliverables.has(delName)) {
        areaObj.deliverables.set(delName, { deliverable_name: delName, metrics: [] });
      }

      const delObj = areaObj.deliverables.get(delName);
      
      const performance = d.yearlyPerformance?.[year] || {};
      
      delObj.metrics.push({
        id: d.id,
        category: d.category,
        indicator: d.indicator,
        baseline_2023: d.baseline2023 || 0,
        [`quarterly_actuals_${year}`]: performance,
        [`annual_${year}`]: performance.annual || { target: 0, actual: 0 },
        projections: d.projections || {},
        annual_targets: d.annualTargets || [],
        performance_direction: d.performanceDirection || 'higher',
        source_of_evidence: d.supportingEvidence
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
