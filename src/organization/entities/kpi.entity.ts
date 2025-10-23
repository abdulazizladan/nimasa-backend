import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'KPI'})
export class KPI {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    name: string;
    target: number;
    actual: number;
    unit: string; // e.g., "percentage", "number", "currency"
    frequency: 'monthly' | 'quarterly' | 'annual';
    deadline: Date;
    status: 'on-track' | 'at-risk' | 'behind';
    weight: number; // Importance weight for overall score calculation
  }