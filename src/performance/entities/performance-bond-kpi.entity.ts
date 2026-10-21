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

  // Set once this record has been copied into strategic_deliverables (category MINISTERIAL).
  // The table is kept as an archive; ministerial deliverables are now managed there.
  @Column({ type: 'datetime', nullable: true })
  migratedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
