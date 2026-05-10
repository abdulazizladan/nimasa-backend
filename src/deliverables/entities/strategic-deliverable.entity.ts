import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Relation } from 'typeorm';
import { DeliverableSubmission } from './deliverable-submission.entity';

export enum DeliverableCategory {
    PRESIDENTIAL_PRIORITY = 'PRESIDENTIAL_PRIORITY',
    HIGH_IMPACT = 'HIGH_IMPACT',
    AGENCY = 'AGENCY',
}

@Entity('strategic_deliverables')
export class StrategicDeliverable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'varchar',
        enum: DeliverableCategory,
        default: DeliverableCategory.AGENCY
    })
    category: DeliverableCategory;

    // Identification
    @Column({ type: 'int' })
    serialNumber: number;

    @Column({ type: 'text' })
    ministry: string;

    @Column({ type: 'text' })
    priorityArea: string;

    @Column({ type: 'text' })
    outcome: string;

    @Column({ type: 'text' })
    deliverable: string;

    // Baseline Information
    @Column({ type: 'text' })
    baselineType: string; // "Annual 2023" or "Q4 2023"

    @Column({ type: 'text' })
    indicator: string;

    @Column({ type: 'float', nullable: true })
    baseline2023: number;

    @Column({ type: 'simple-json', nullable: true })
    yearlyPerformance: Record<string, any>;

    @Column({ type: 'simple-json', nullable: true })
    projections: Record<string, number>;

    // Metadata
    @Column({ type: 'text' })
    responsibleDepartment: string;

    @Column({ type: 'text' })
    supportingEvidence: string;

    // Relationship with monthly submissions
    @OneToMany(() => DeliverableSubmission, submission => submission.deliverable)
    monthlySubmissions: Relation<DeliverableSubmission>[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
