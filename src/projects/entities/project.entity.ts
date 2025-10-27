import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Challenge } from "./challenge.entity";
import { Recommendation } from "./recommendation.entity";
import { PriorityArea } from "src/organization/entities/priority-area.entity";
import { Deliverable } from "src/organization/entities/deliverable.entity";

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

    @OneToMany((type) => Challenge, challenge => challenge.project)
    challenges: Challenge[];

    @OneToMany((type) => Recommendation, recommendation => recommendation.project)
    recommendations: Recommendation[];
}