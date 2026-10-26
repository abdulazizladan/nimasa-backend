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
 * 2. Removes the old "priority area names are unique across all lists" constraint (once), so the
 *    national and agency lists can each have an area with the same name.
 * 3. Starts the agency priority-area list from the areas agency deliverables use (once).
 * 4. Renumbers deliverables whose serial numbers clash on a list (serial numbers are now
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
            if (await this.dropLegacyPriorityAreaUnique()) {
                this.logger.log('Removed the old unique-name constraint from priority areas.');
            }
        } catch (err) {
            this.logger.error('Updating the priority areas table failed', err as Error);
        }
        try {
            const seeded = await this.deliverablesService.seedAgencyPriorityAreas();
            if (seeded > 0) {
                this.logger.log(`Started the agency priority-area list with ${seeded} area(s) used by agency deliverables.`);
            }
        } catch (err) {
            this.logger.error('Seeding agency priority areas failed', err as Error);
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

    /**
     * Priority area names used to be unique across all areas. TypeORM's schema sync never drops
     * that constraint, so rebuild the (small) table without it when it is still there. SQLite only.
     */
    async dropLegacyPriorityAreaUnique(): Promise<boolean> {
        if (this.dataSource.options.type !== 'sqlite') return false;
        const [table] = await this.dataSource.query(
            `SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'presidential_priority_areas'`
        );
        if (!table?.sql || !/UNIQUE \("name"\)/.test(table.sql)) return false;

        const columns = '"id", "name", "description", "createdAt", "updatedAt", "scope"';
        await this.dataSource.transaction(async (manager) => {
            await manager.query(`CREATE TABLE "temporary_presidential_priority_areas" (
                "id" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "scope" varchar NOT NULL DEFAULT ('national'))`);
            await manager.query(`INSERT INTO "temporary_presidential_priority_areas" (${columns})
                SELECT ${columns} FROM "presidential_priority_areas"`);
            await manager.query(`DROP TABLE "presidential_priority_areas"`);
            await manager.query(`ALTER TABLE "temporary_presidential_priority_areas" RENAME TO "presidential_priority_areas"`);
        });
        return true;
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
