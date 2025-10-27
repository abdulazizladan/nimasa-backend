import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";

@Entity({name: 'Recommendation'})
export class Recommendation {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string

    @ManyToOne((type) => Project, project => project.recommendations)
    project: Project;
}