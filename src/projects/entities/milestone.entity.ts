import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Project } from "./project.entity";

@Entity({name: 'Milestone'})
export class Milestone {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string; // Add a description for the milestone

    @Column({ type: 'date', nullable: true })
    plannedDate: Date; // The planned due date

    @Column({ type: 'date', nullable: true })
    actualDate: Date; // The actual completion date

    @Column({ type: 'int', default: 0 })
    progressPercentage: number; // 0 to 100 for tracking progress

    // Relate Milestone to Project (Many-to-One)
    @ManyToOne(() => Project, project => project.milestones)
    project: Project;
}