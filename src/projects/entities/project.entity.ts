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

    @Column({ nullable: true })
    startDate: Date;

    @Column()
    title: string;

    @Column()
    objective: string;

    @Column()
    budgetCode: string;

    @Column()
    amountAppropriated: number;

    @Column()
    totalCost: number;

    @Column({default: "NGN"})
    currency: string;

    @Column()
    foreignComponent: string;

    @Column()
    fundingSource: string;

    @Column()
    projectType: string;

    @Column()
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