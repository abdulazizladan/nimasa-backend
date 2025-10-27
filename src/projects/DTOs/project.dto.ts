import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsUUID,
    IsNumber,
    Min,
    IsIn,
    IsArray
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

// --- Response DTOs for Child Entities (used in ProjectDto) ---

// Define a minimal DTO for related entities to prevent circular dependencies
class MinimalChallengeDto {
    @ApiProperty({ example: 'uuid-challenge-1' })
    id: string;
    @ApiProperty({ example: 'Delay in vendor delivery.' })
    description: string;
}

class MinimalRecommendationDto {
    @ApiProperty({ example: 'uuid-recommendation-1' })
    id: string;
    @ApiProperty({ example: 'Increase daily scrum frequency.' })
    description: string;
}

// --- 1. Create DTO (Used for POST requests) ---
export class CreateProjectDto {
    @ApiProperty({ description: 'The UUID of the associated Priority Area.' })
    @IsUUID()
    @IsNotEmpty()
    priorityAreaId: string;

    @ApiProperty({ description: 'The UUID of the associated Deliverable.' })
    @IsUUID()
    @IsNotEmpty()
    deliverableId: string;

    @ApiProperty({ description: 'The planned start date of the project (ISO 8601 format).', required: false })
    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @ApiProperty({ description: 'The official title of the project.' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'The main objective or goal of the project.' })
    @IsString()
    @IsNotEmpty()
    objective: string;

    @ApiProperty({ description: 'The official budget code.' })
    @IsString()
    @IsNotEmpty()
    budgetCode: string;

    @ApiProperty({ description: 'The amount of funds officially appropriated.' })
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    amountAppropriated: number;

    @ApiProperty({ description: 'The total estimated cost of the project.' })
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    totalCost: number;

    @ApiProperty({ description: 'The currency used for the budget (e.g., NGN, USD). Defaults to NGN.', default: 'NGN', required: false })
    @IsString()
    @IsIn(['NGN', 'USD', 'EUR', 'GBP'])
    @IsOptional()
    currency?: string = 'NGN';

    @ApiProperty({ description: 'Details about the foreign component of the project.' })
    @IsString()
    @IsNotEmpty()
    foreignComponent: string;

    @ApiProperty({ description: 'The primary source of funding for the project.' })
    @IsString()
    @IsNotEmpty()
    fundingSource: string;

    @ApiProperty({ description: 'The classification or type of project.' })
    @IsString()
    @IsNotEmpty()
    projectType: string;

    @ApiProperty({ description: 'The current status of the project.' })
    @IsString()
    @IsNotEmpty()
    status: string;
}

// --- 2. Update DTO (Used for PATCH/PUT requests) ---
// Inherits CreateProjectDto and makes all fields optional
export class UpdateProjectDto extends PartialType(CreateProjectDto) {}

// --- 3. Response DTO (Used for standardized API responses) ---
export class ProjectDto {
    @ApiProperty({ description: 'The unique UUID of the project.' })
    id: string;

    // Relationship fields - Typically return the full related object or a minimal representation
    @ApiProperty({ description: 'The associated Priority Area object.' })
    priorityArea: { id: string, name: string }; // Assuming PriorityArea has an ID and a name

    @ApiProperty({ description: 'The associated Deliverable object.'})
    deliverable: { id: string, name: string }; // Assuming Deliverable has an ID and a name

    @ApiProperty({ description: 'The project start date.' })
    startDate: Date;

    @ApiProperty({ description: 'The official title.' })
    title: string;

    @ApiProperty({ description: 'The project objective.' })
    objective: string;

    @ApiProperty({ description: 'The budget code.' })
    budgetCode: string;

    @ApiProperty({ description: 'Amount appropriated.' })
    amountAppropriated: number;

    @ApiProperty({ description: 'Total estimated cost.' })
    totalCost: number;

    @ApiProperty({ description: 'Currency code.' })
    currency: string;

    @ApiProperty({ description: 'Foreign component details.' })
    foreignComponent: string;

    @ApiProperty({ description: 'Funding source.' })
    fundingSource: string;

    @ApiProperty({ description: 'Project type.' })
    projectType: string;

    @ApiProperty({ description: 'Project status.' })
    status: string;

    // Child Collections
    @ApiProperty({ 
        description: 'A list of challenges associated with the project.', 
        type: [MinimalChallengeDto], 
        required: false 
    })
    @IsOptional()
    @IsArray()
    challenges?: MinimalChallengeDto[];

    @ApiProperty({ 
        description: 'A list of recommendations associated with the project.', 
        type: [MinimalRecommendationDto], 
        required: false 
    })
    @IsOptional()
    @IsArray()
    recommendations?: MinimalRecommendationDto[];
}