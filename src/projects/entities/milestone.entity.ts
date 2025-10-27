import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'Milestone'})
export class Milestone {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    actual: string;

    @Column()
    planned: string;
}