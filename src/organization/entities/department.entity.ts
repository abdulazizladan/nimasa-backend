import { KPI } from "./kpi.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Organization } from "./organization.entity";

@Entity({name: 'Department'})
export class Department {

    // Using PrimaryGeneratedColumn is often better practice for relational IDs
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    code: string; // Keeping 'code' as unique identifier

    @Column({ length: 100 })
    name: string;

    @Column({ nullable: true, type: 'text' })
    description?: string; // Explicitly marked nullable

    @Column({ length: 50 })
    head: string; // Assuming 'head' is the name of the department head

    @Column({ nullable: true, length: 100 })
    directorEmail?: string; // Explicitly marked nullable

    @Column({ nullable: true, length: 20 })
    contactPhone?: string; // Explicitly marked nullable

    // The foreign key relationship
    @ManyToOne(() => Organization, organization => organization.departments, { onDelete: 'CASCADE' })
    organization: Organization;

    // Strategic alignment
    //strategicPillars: string[]; // NIMASA strategic pillars

    //keyPerformanceIndicators: KPI[];
    
    // Additional NIMASA-specific fields
    //maritimeDomain?: 'safety' | 'security' | 'environment' | 'commercial' | 'administration';

    //budgetAllocation?: number;

    //actualSpending?: number;

    //@ManyToOne((type) => Organization, organization => organization.departments)
    //organization: Organization;
}

/**
 * export interface Department {
    id: string;
    code: string;
    name: string;
    description?: string;
    director: string;
    directorEmail?: string;
    contactPhone?: string;
    
    // Performance metrics
    performanceScore: number;
    totalTargets: number;
    completedTargets: number;
    pendingTargets: number;
    overdueTargets: number;
    
    // Organizational structure
    unitCount: number;
    staffCount: number;
    parentDepartmentId?: string; // For hierarchical structure
    childDepartments?: Department[];
    
    // Status and metadata
    status: 'active' | 'inactive' | 'restructured';
    createdAt: Date;
    updatedAt: Date;
    fiscalYear: string; // e.g., "2024"
    
    // Strategic alignment
    strategicPillars: string[]; // NIMASA strategic pillars
    keyPerformanceIndicators: KPI[];
    
    // Additional NIMASA-specific fields
    maritimeDomain?: 'safety' | 'security' | 'environment' | 'commercial' | 'administration';
    budgetAllocation?: number;
    actualSpending?: number;
  }
  
  export interface KPI {
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
  
  export interface Unit {
    id: string;
    departmentId: string;
    code: string;
    name: string;
    head: string;
    headEmail?: string;
    staffCount: number;
    performanceScore: number;
    status: 'active' | 'inactive';
    description?: string;
  }
  
  export interface DepartmentFilter {
    search: string;
    status: string[];
    performance: string;
    maritimeDomain?: string;
    strategicPillar?: string;
  }
 */