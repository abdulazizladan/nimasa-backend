import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PriorityArea } from "./priority-area.entity";
import { OutputIndicator } from "./indicator.entity";
import { Project } from "src/projects/entities/project.entity";

@Entity({name: 'Deliverable'})
export class Deliverable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @ManyToOne((type) => PriorityArea, priorityArea => priorityArea.deliverables)
    priorityArea: PriorityArea;

    @OneToMany((type) => OutputIndicator, outputIndicator => outputIndicator.deliverable)
    outputIndicators: OutputIndicator[];

    @OneToMany((type) => Project, project => project.deliverable)
    projects: Project[];
}