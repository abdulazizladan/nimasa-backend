import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

/**
 * Which deliverables pages a priority area belongs to: presidential and ministerial deliverables
 * share the national list; agency deliverables have their own.
 */
export const PRIORITY_AREA_SCOPES = ['national', 'agency'] as const;
export type PriorityAreaScope = typeof PRIORITY_AREA_SCOPES[number];

@Entity('presidential_priority_areas')
@Unique(['name', 'scope'])
export class PresidentialPriorityArea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    name: string;

    @Column({ type: 'varchar', default: 'national' })
    scope: PriorityAreaScope;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
