import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'Performance'})
export class Performance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
}