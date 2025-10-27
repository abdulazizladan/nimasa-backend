import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Deliverable } from "./deliverable.entity";
import { Organization } from "./organization.entity";
import { Project } from "src/projects/entities/project.entity";

@Entity({name: "PriorityArea"})
export class PriorityArea {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    area: string;

    @OneToMany((type) => Deliverable, deliverable => deliverable.priorityArea)
    deliverables: Deliverable[];

    @ManyToOne((type) => Organization, organization => organization.priorityAreas)
    organization: Organization;

    @OneToMany((type) => Project, project => project.priorityArea)
    projects: Project[];
}