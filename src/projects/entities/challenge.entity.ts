import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Project } from "./project.entity";

@Entity({name: "Challenge"})
export class Challenge {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @ManyToOne((type) => Project, project => project.challenges)
    project: Relation<Project>;

}