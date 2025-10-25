import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Deliverable } from "./deliverable.entity";

@Entity({name: 'OutputIndicator'})
export class OutputIndicator {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @ManyToOne((type) => Deliverable, deliverable => deliverable.outputIndicators)
    deliverable: Deliverable;
}