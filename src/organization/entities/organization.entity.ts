import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Department } from "./department.entity";
import { PriorityArea } from "./priority-area.entity";

@Entity({name: 'Organization'})
export class Organization {

    @PrimaryColumn({ length: 10, unique: true })
    code: string; // Assuming organization code is the PK

    @Column({ unique: true, length: 150 })
    name: string;

    @Column({ nullable: true, type: 'text' })
    motto: string; // Setting nullable true as it might be optional in the future

    @Column({ nullable: true })
    logo: string; // Storing URL or path to the logo

    @Column({ default: true })
    isActive: boolean; // Added an active status for better management

    @OneToMany(() => Department, department => department.organization)
    departments: Department[];

    @OneToMany((type) => PriorityArea, priorityArea => priorityArea.organization)
    priorityAreas: PriorityArea[];
}