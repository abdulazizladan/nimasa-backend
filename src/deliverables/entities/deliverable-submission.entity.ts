import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Relation } from 'typeorm';
import { StrategicDeliverable } from './strategic-deliverable.entity';

@Entity('deliverable_submissions')
export class DeliverableSubmission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => StrategicDeliverable, deliverable => deliverable.monthlySubmissions, { onDelete: 'CASCADE' })
    deliverable: Relation<StrategicDeliverable>;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'int', nullable: true })
    month: number; // 1-12 (optional for quarterly)

    @Column({ type: 'varchar', nullable: true })
    quarter: string; // Q1, Q2, Q3, Q4

    // Monthly/Quarterly actual value
    @Column({ type: 'float', nullable: true })
    actualValue: number;

    @Column({ type: 'float', nullable: true })
    targetValue: number;

    @Column({ type: 'varchar', nullable: true })
    supportingDocType: string;

    // Progress tracking
    @Column({ type: 'text', nullable: true })
    progress: string; // Milestones achieved

    @Column({ type: 'text', nullable: true })
    keyIssues: string; // Challenges faced

    @Column({ type: 'text', nullable: true })
    mdaEfforts: string; // MDA's efforts to resolve issues

    @Column({ type: 'text', nullable: true })
    comments: string; // Support required

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
