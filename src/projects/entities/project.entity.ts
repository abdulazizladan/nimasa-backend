import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Challenge } from "./challenge.entity";
import { Recommendation } from "./recommendation.entity";
import { PriorityArea } from "src/organization/entities/priority-area.entity";
import { Deliverable } from "src/organization/entities/deliverable.entity";
import { Milestone } from "./milestone.entity";
import { Comment } from "./comment.entity";

@Entity({name: "Project"})
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne((type) => PriorityArea, priorityArea => priorityArea.projects)
    priorityArea: PriorityArea;

    @ManyToOne((type) => Deliverable, deliverable => deliverable.projects)
    deliverable: Deliverable;

    @Column({ type: 'date', nullable: true })
    startDate: Date;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'text' })
    objective: string;

    @Column({ type: 'varchar' })
    budgetCode: string;

    @Column({ type: 'float', default: 0 })
    amountAppropriated: number;

    @Column({ type: 'float', default: 0 })
    totalCost: number;

    @Column({ type: 'varchar', default: 'NGN' })
    currency: string;

    @Column({ type: 'varchar' })
    foreignComponent: string;

    @Column({ type: 'varchar' })
    fundingSource: string;

    @Column({ type: 'varchar' })
    projectType: string;

    @Column({ type: 'varchar' })
    status: string;

    // New One-to-Many relationship for Milestones
    @OneToMany(() => Milestone, milestone => milestone.project)
    milestones: Milestone[];

    // New One-to-Many relationship for Comments
    @OneToMany(() => Comment, comment => comment.project)
    comments: Comment[];

    @OneToMany((type) => Challenge, challenge => challenge.project)
    challenges: Challenge[];

    @OneToMany((type) => Recommendation, recommendation => recommendation.project)
    recommendations: Recommendation[];
}