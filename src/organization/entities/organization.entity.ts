import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'Organization'})
export class Organization {

    @PrimaryColumn({})
    code: string;

    @Column({})
    name: string;

    @Column({})
    motto: string;
}