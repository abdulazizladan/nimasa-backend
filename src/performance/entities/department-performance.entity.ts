import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from '../../organization/entities/department.entity';

@Entity({ name: 'DepartmentMonthlyPerformance' })
export class DepartmentMonthlyPerformance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Department, { onDelete: 'CASCADE' })
  department: Department;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'int' })
  month: number; // 1-12

  @Column({ type: 'date', nullable: true })
  periodStart?: Date;

  @Column({ type: 'date', nullable: true })
  periodEnd?: Date;

  // Aggregated performance metrics for the month
  @Column({ type: 'float', default: 0 })
  performanceScore: number;

  @Column({ type: 'int', default: 0 })
  totalTargets: number;

  @Column({ type: 'int', default: 0 })
  completedTargets: number;

  @Column({ type: 'int', default: 0 })
  pendingTargets: number;

  @Column({ type: 'int', default: 0 })
  overdueTargets: number;

  // Optional additional context
  @Column({ type: 'text', nullable: true })
  notes?: string;
}
