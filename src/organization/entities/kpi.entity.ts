import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'KPI'})
export class KPI {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'float', default: 0 })
    target: number;

    @Column({ type: 'float', default: 0 })
    actual: number;

    @Column({ type: 'varchar' })
    unit: string; // e.g., "percentage", "number", "currency"

    @Column({ type: 'varchar' })
    frequency: string; // 'monthly' | 'quarterly' | 'annual'

    @Column({ type: 'date', nullable: true })
    deadline: Date;

    @Column({ type: 'varchar', default: 'on-track' })
    status: string; // 'on-track' | 'at-risk' | 'behind'

    @Column({ type: 'float', default: 0 })
    weight: number;
}