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
    // 1. CREATE Operation (No change needed here for new entities)
    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        // ... (existing create logic)
        const newProject = this.projectRepository.create({
            ...createProjectDto,
            priorityArea: { id: createProjectDto.priorityAreaId } as any,
            deliverable: { id: createProjectDto.deliverableId } as any,
        });
    
        delete (newProject as any).priorityAreaId;
        delete (newProject as any).deliverableId;
        
        return this.projectRepository.save(newProject);
    }

    // 2. READ All Operation - UPDATED
    /**
     * Retrieves all Projects, including related entities, milestones, and comments.
     */
    async findAll(): Promise<Project[]> {
        // Eagerly load the related entities for comprehensive listing
        return this.projectRepository.find({
            relations: [
                'priorityArea', 
                'deliverable', 
                'challenges', 
                'recommendations',
                'milestones', // ADDED
                'comments'    // ADDED
            ],
            // Order milestones for consistent progress tracking
            order: {
                milestones: {
                    plannedDate: "ASC"
                },
                comments: {
                    createdAt: "DESC"
                }
            }
        });
    }

    // 2. READ One Operation - UPDATED
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
                'recommendations',
                'milestones', // ADDED
                'comments'    // ADDED
            ],
             // Order milestones and comments
            order: {
                milestones: {
                    plannedDate: "ASC"
                },
                comments: {
                    createdAt: "DESC"
                }
            }
        });

        if (!project) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }

        return project;
    }

    // 3. UPDATE Operation (No change needed here)
    async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
        // ... (existing update logic)
        const project = await this.findOne(id);

        const updateData: any = { ...updateProjectDto };

        if (updateProjectDto.priorityAreaId) {
            updateData.priorityArea = { id: updateProjectDto.priorityAreaId };
            delete updateData.priorityAreaId;
        }

        if (updateProjectDto.deliverableId) {
            updateData.deliverable = { id: updateProjectDto.deliverableId };
            delete updateData.deliverableId;
        }

        const updatedProject = Object.assign(project, updateData);

        return this.projectRepository.save(updatedProject);
    }

    // 4. DELETE Operation (No change needed here)
    async remove(id: string): Promise<void> {
        // ... (existing remove logic)
        const result = await this.projectRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Project with ID "${id}" not found.`);
        }
    }
}
