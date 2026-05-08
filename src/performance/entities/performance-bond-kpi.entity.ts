import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('performance_bond_kpis')
export class PerformanceBondKPI {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  priorityArea: string;

  @Column({ type: 'text' })
  deliverable: string;

  @Column({ type: 'text' })
  indicator: string;

  @Column({ type: 'float', nullable: true })
  baseline2023: number;

  @Column({ type: 'text', nullable: true })
  sourceOfEvidence: string;

  @Column({ type: 'text', nullable: true })
  evidenceFile: string;

  @Column({ type: 'simple-json', nullable: true })
  yearlyPerformance: Record<string, any>;

  @Column({ type: 'simple-json', nullable: true })
  projections: Record<string, number>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
