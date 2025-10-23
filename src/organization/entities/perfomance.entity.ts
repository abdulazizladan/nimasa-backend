import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'Performance'})
export class Performance {
     // Performance metrics
     @PrimaryGeneratedColumn('uuid')
     id: string;
     performanceScore: number;
     totalTargets: number;
     completedTargets: number;
     pendingTargets: number;
     overdueTargets: number;
}