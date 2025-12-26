import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Deliverable } from './deliverable.entity';

@Entity('monthly_submissions')
export class MonthlySubmission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Deliverable, deliverable => deliverable.monthlySubmissions, { onDelete: 'CASCADE' })
    deliverable: Deliverable;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'int' })
    month: number; // 1-12

    // Monthly actual value
    @Column({ type: 'float', nullable: true })
    actualValue: number;

    // Progress tracking
    @Column({ type: 'text' })
    progress: string; // Milestones achieved

    @Column({ type: 'text' })
    keyIssues: string; // Challenges faced

    @Column({ type: 'text' })
    mdaEfforts: string; // MDA's efforts to resolve issues

    @Column({ type: 'text' })
    comments: string; // Support required

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
