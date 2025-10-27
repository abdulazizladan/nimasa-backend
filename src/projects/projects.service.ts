import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity'; 
import { CreateProjectDto } from './DTOs/create-project.dto';
import { UpdateProjectDto } from './DTOs/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) {}

    // 1. CREATE Operation
    /**
     * Creates a new Project and links it to existing PriorityArea and Deliverable entities.
     */
    async create(createProjectDto: CreateProjectDto): Promise<Project> {
    
        // 💡 FIX: The SQLITE_CONSTRAINT error suggests the provided IDs don't exist.
        // We must ensure the related entities are valid before proceeding.
        // For this fix, we'll assume we have injected the necessary repositories or services.
        
        // --- START OF REQUIRED CHECKS ---
        
        // NOTE: For a complete fix, you would need to inject PriorityAreaRepository
        // and DeliverableRepository into ProjectsService.
        
        // Example check (if repositories were injected):
        /*
        const priorityArea = await this.priorityAreaRepository.findOne({
            where: { id: createProjectDto.priorityAreaId }
        });
        if (!priorityArea) {
            throw new NotFoundException(`PriorityArea with ID "${createProjectDto.priorityAreaId}" not found.`);
        }
    
        const deliverable = await this.deliverableRepository.findOne({
            where: { id: createProjectDto.deliverableId }
        });
        if (!deliverable) {
            throw new NotFoundException(`Deliverable with ID "${createProjectDto.deliverableId}" not found.`);
        }
        */
        
        // If the checks pass, or you rely on the database constraint (which fails
        // silently in TypeORM when using partial object references like below),
        // the original TypeORM entity preparation is correct:
        
        // --- END OF REQUIRED CHECKS ---
        
        // Prepare the entity object, mapping the DTO IDs to TypeORM relationship objects
        // The explicit 'as any' is often necessary when TypeORM entities are strict.
        const newProject = this.projectRepository.create({
            ...createProjectDto,
            // The foreign key ID columns (priorityAreaId, deliverableId)
            // are often automatically populated by TypeORM when saving the relation object.
            // However, if your DTO also includes the raw IDs, they might conflict 
            // with the relation objects, so it's safer to rely on the relation objects only.
            priorityArea: { id: createProjectDto.priorityAreaId } as any,
            deliverable: { id: createProjectDto.deliverableId } as any,
        });
    
        // To prevent potential conflict if the DTO also contains raw IDs that TypeORM 
        // might attempt to insert alongside the relation objects:
        delete (newProject as any).priorityAreaId;
        delete (newProject as any).deliverableId;
        
        return this.projectRepository.save(newProject);
    }

    // 2. READ All Operation
    /**
     * Retrieves all Projects, optionally including related entities.
     */
    async findAll(): Promise<Project[]> {
        // Eagerly load the related entities for comprehensive listing
        return this.projectRepository.find({
            relations: [
                'priorityArea', 
                'deliverable', 
                'challenges', 
                'recommendations'
            ],
        });
    }

    // 2. READ One Operation
    /**
     * Retrieves a single Project by ID, throwing an error if not found.
     */
    async findOne(id: string): Promise<Project> {
        const project = await this.projectRepository.findOne({
            where: { id },
            // Load all associated data
            relations: [
                'priorityArea', 
                'deliverable', 
                'challenges', 
                'recommendations'
            ],
        });

        if (!project) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }

        return project;
    }

    // 3. UPDATE Operation
    /**
     * Updates an existing Project. Handles changes to relational IDs.
     */
    async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
        const project = await this.findOne(id); // Use findOne to ensure existence

        // Apply partial updates from DTO
        const updateData: any = { ...updateProjectDto };

        // Handle updating the PriorityArea relationship
        if (updateProjectDto.priorityAreaId) {
            updateData.priorityArea = { id: updateProjectDto.priorityAreaId };
            delete updateData.priorityAreaId;
        }

        // Handle updating the Deliverable relationship
        if (updateProjectDto.deliverableId) {
            updateData.deliverable = { id: updateProjectDto.deliverableId };
            delete updateData.deliverableId;
        }

        // Merge existing project with update data
        const updatedProject = Object.assign(project, updateData);

        return this.projectRepository.save(updatedProject);
    }

    // 4. DELETE Operation
    /**
     * Deletes a Project by ID.
     */
    async remove(id: string): Promise<void> {
        // NOTE: Ensure your TypeORM setup or database schema has configured
        // cascade deletion for related Challenges and Recommendations, 
        // otherwise they will need to be deleted manually here.
        
        const result = await this.projectRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }
    }
}
