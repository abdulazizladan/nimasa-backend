import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Project } from "./project.entity";

@Entity({ name: 'Comment' })
export class Comment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string; // The text of the comment

    @Column({ nullable: true })
    author: string; // e.g., Department, User ID (in a real app)

    @CreateDateColumn()
    createdAt: Date; // Automatically record when the comment was made

    // Relate Comment to Project (Many-to-One)
    @ManyToOne(() => Project, project => project.comments)
    project: Project;
}