import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource, IsNull } from 'typeorm';
import { StrategicDeliverable, DeliverableCategory } from './entities/strategic-deliverable.entity';
import { PerformanceBondKPI } from '../performance/entities/performance-bond-kpi.entity';
import { DeliverablesService } from './deliverables.service';

/**
 * Data upkeep run when the API starts:
 *
 * 1. Moves ministerial deliverables from the original performance_bond_kpis table into
 * strategic_deliverables (category MINISTERIAL) so they share the presidential workflow:
 * serial numbers, annual targets, quarterly reports, report details, etc.
 *
 *    Only rows not yet migrated are copied. Each copy keeps its original id, figures and dates;
 *    the source row is kept and stamped with migratedAt, never deleted.
 * 2. Renumbers deliverables whose serial numbers clash on a list (serial numbers are now
 *    assigned automatically; this repairs numbers entered by hand before that).
 *
 * Both steps do nothing once the data is in order.
 */
@Injectable()
export class DeliverablesStartupService implements OnApplicationBootstrap {
    private readonly logger = new Logger(DeliverablesStartupService.name);

    constructor(
        private readonly dataSource: DataSource,
        private readonly deliverablesService: DeliverablesService,
    ) { }

    async onApplicationBootstrap(): Promise<void> {
        // Failures are logged but don't stop the API from starting; the next start retries
        try {
            const migrated = await this.migrateMinisterial();
            if (migrated > 0) {
                this.logger.log(`Moved ${migrated} ministerial deliverable(s) into strategic_deliverables.`);
            }
        } catch (err) {
            this.logger.error('Ministerial deliverables migration failed', err as Error);
        }
        try {
            const renumbered = await this.deliverablesService.renumberDuplicateSerials();
            if (renumbered > 0) {
                this.logger.log(`Renumbered ${renumbered} deliverable(s) with duplicate serial numbers.`);
            }
        } catch (err) {
            this.logger.error('Serial number repair failed', err as Error);
        }
    }

    async migrateMinisterial(): Promise<number> {
        return this.dataSource.transaction(async (manager) => {
            const legacyRepo = manager.getRepository(PerformanceBondKPI);
            const deliverableRepo = manager.getRepository(StrategicDeliverable);

            const pending = await legacyRepo.find({ where: { migratedAt: IsNull() }, order: { createdAt: 'ASC' } });
            if (pending.length === 0) return 0;

            for (const kpi of pending) {
                // Already copied (e.g. a previous run stopped before stamping): just stamp it
                const exists = await deliverableRepo.findOne({ where: { id: kpi.id } });
                if (!exists) {
                    await deliverableRepo.insert({
                        id: kpi.id,
                        category: DeliverableCategory.MINISTERIAL,
                        // Continue the ministerial serial numbers
                        serialNumber: await this.deliverablesService.nextSerialNumber(DeliverableCategory.MINISTERIAL, manager),
                        ministry: 'NIMASA',
                        priorityArea: kpi.priorityArea,
                        // The ministerial "deliverable" text is the deliverable's title
                        outcome: kpi.deliverable,
                        deliverable: '',
                        indicator: kpi.indicator,
                        // Ministerial baselines were recorded for 2023
                        baselineYear: 2023,
                        baselineType: '',
                        baseline2023: kpi.baseline2023,
                        supportingEvidence: kpi.sourceOfEvidence ?? '',
                        evidenceFile: kpi.evidenceFile ?? null,
                        yearlyPerformance: kpi.yearlyPerformance ?? {},
                        projections: kpi.projections ?? {},
                        responsibleDepartment: '',
                        createdAt: kpi.createdAt,
                        updatedAt: kpi.updatedAt,
                    });
                }
                await legacyRepo.update(kpi.id, { migratedAt: new Date() });
            }
            return pending.length;
        });
    }
}
