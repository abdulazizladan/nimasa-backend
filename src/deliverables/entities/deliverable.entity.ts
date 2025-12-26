import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { MonthlySubmission } from './monthly-submission.entity';

@Entity('deliverables')
export class Deliverable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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

    // Q1 2024
    @Column({ type: 'float', nullable: true })
    q1_2024_target: number;

    @Column({ type: 'float', nullable: true })
    q1_2024_actual: number;

    // Q2 2024
    @Column({ type: 'float', nullable: true })
    q2_2024_target: number;

    @Column({ type: 'float', nullable: true })
    q2_2024_actual: number;

    @Column({ type: 'float', nullable: true })
    q2_2024_cumulative_actual: number;

    // Q3 2024
    @Column({ type: 'float', nullable: true })
    q3_2024_target: number;

    @Column({ type: 'float', nullable: true })
    q3_2024_actual: number;

    @Column({ type: 'float', nullable: true })
    q3_2024_cumulative_actual: number;

    // Q4 2024
    @Column({ type: 'float', nullable: true })
    q4_2024_target: number;

    @Column({ type: 'float', nullable: true })
    q4_2024_actual: number;

    // Annual Targets
    @Column({ type: 'float', nullable: true })
    annual_2024_target: number;

    @Column({ type: 'float', nullable: true })
    annual_2024_actual: number;

    @Column({ type: 'float', nullable: true })
    target_2025: number;

    @Column({ type: 'float', nullable: true })
    target_2026: number;

    @Column({ type: 'float', nullable: true })
    target_2027: number;

    // Metadata
    @Column({ type: 'text' })
    responsibleDepartment: string;

    @Column({ type: 'text' })
    supportingEvidence: string;

    // Relationship with monthly submissions
    @OneToMany(() => MonthlySubmission, submission => submission.deliverable)
    monthlySubmissions: MonthlySubmission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
