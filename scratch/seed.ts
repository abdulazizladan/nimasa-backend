import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DeliverablesService } from '../src/deliverables/deliverables.service';
import { DeliverableCategory } from '../src/deliverables/entities/deliverable.entity';
import { PerformanceService } from '../src/performance/performance.service';

async function seed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const deliverablesService = app.get(DeliverablesService);
    const performanceService = app.get(PerformanceService);

    console.log('Seeding Agency Deliverables...');
    const agencyDeliverables = [
        {
            serialNumber: 1,
            ministry: 'Federal Ministry of Marine and Blue Economy',
            priorityArea: '5. Enhance infrastructure and transportation as enablers of growth',
            outcome: 'Improved Port Throughput',
            deliverable: 'Enhance Port Efficiency',
            baselineType: 'Annual 2023',
            indicator: 'Port turnaround time (hours)',
            baseline2023: 72,
            q1_2024_target: 60,
            q1_2024_actual: 65,
            responsibleDepartment: 'Operations',
            supportingEvidence: 'Port Authority Performance Report Q1 2024'
        },
        {
            serialNumber: 2,
            ministry: 'Federal Ministry of Marine and Blue Economy',
            priorityArea: '5. Enhance infrastructure and transportation as enablers of growth',
            outcome: 'Improved Safety at Sea',
            deliverable: 'Improve Maritime Safety',
            baselineType: 'Annual 2023',
            indicator: 'Number of maritime incidents recorded',
            baseline2023: 45,
            q1_2024_target: 35,
            q1_2024_actual: 33,
            responsibleDepartment: 'Safety & Security',
            supportingEvidence: 'Maritime Incident Report Q1 2024'
        }
    ];

    for (const d of agencyDeliverables) {
        await deliverablesService.create(d as any, DeliverableCategory.AGENCY);
    }

    console.log('Seeding High Impact Deliverables...');
    const highImpactDeliverables = [
        {
            serialNumber: 1,
            ministry: 'Federal Ministry of Marine and Blue Economy',
            priorityArea: '5. Enhance infrastructure and transportation as enablers of growth',
            outcome: 'Improved Safety of Transportation',
            deliverable: 'Enhance Maritime Safety, Security & Compliance to global acceptable standards',
            baselineType: 'Annual 2023',
            indicator: 'Number of Piracy and Sea Robbery incidences recorded',
            baseline2023: 0,
            q1_2024_target: 0,
            q1_2024_actual: 0,
            responsibleDepartment: 'NIMASA',
            supportingEvidence: 'Approved Piracy and Sea Robbery reports signed by Director'
        }
    ];

    for (const d of highImpactDeliverables) {
        await deliverablesService.create(d as any, DeliverableCategory.HIGH_IMPACT);
    }

    console.log('Seeding Performance Bond KPIs...');
    const performanceKpis = [
        {
            priorityArea: 'Blue Economy Development',
            deliverable: 'Deep Sea Mining Regulation',
            indicator: 'Draft policy submitted',
            baseline2023: 0,
            sourceOfEvidence: 'Draft Policy Document',
            yearlyPerformance: {
                '2024': {
                    q1: { target: 1, actual: 1, cumulative: 1 },
                    q2: { target: 0, actual: 0, cumulative: 1 },
                    q3: { target: 0, actual: 0, cumulative: 1 },
                    q4: { target: 0, actual: 0, cumulative: 1 },
                    annual: { target: 1, actual: 1, cumulative: 1 }
                }
            },
            projections: { '2025': 1, '2026': 1 }
        }
    ];

    for (const kpi of performanceKpis) {
        await performanceService.createKPI(kpi as any);
    }

    await app.close();
    console.log('Seeding complete!');
}

seed().catch(err => {
    console.error('Seeding failed', err);
    process.exit(1);
});
