import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsUUID,
    IsNumber,
    Min,
    IsCurrency,
    IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMilestoneDto } from './create-milestone.dto';
import { CreateCommentDto } from './create-comment.dto';

export class CreateProjectDto {
    @ApiProperty({
        description: 'The UUID of the associated Priority Area.',
        example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    })
    @IsUUID()
    @IsNotEmpty()
    priorityAreaId: string; // Use ID for relationship creation

    @ApiProperty({
        description: 'The UUID of the associated Deliverable.',
        example: 'f0e9d8c7-b6a5-4321-9876-543210fedcba',
    })
    @IsUUID()
    @IsNotEmpty()
    deliverableId: string; // Use ID for relationship creation

    @ApiProperty({
        description: 'The planned start date of the project (ISO 8601 format).',
        example: '2025-10-01T00:00:00Z',
        required: false,
    })
    @IsOptional()
    @IsDateString()
    startDate?: Date; // Use Date object for TypeORM, but validate as string/date format

    @ApiProperty({
        description: 'The official title of the project.',
        example: 'Digital Transformation Phase II',
        maxLength: 255,
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'The main objective or goal of the project.',
        example: 'To fully digitize all internal HR processes within 18 months.',
    })
    @IsString()
    @IsNotEmpty()
    objective: string;

    @ApiProperty({
        description: 'The official budget code assigned to the project.',
        example: 'PROJ-2025-004',
    })
    @IsString()
    @IsNotEmpty()
    budgetCode: string;

    @ApiProperty({
        description: 'The amount of funds officially appropriated for the project.',
        example: 50000000.00,
        type: 'number',
    })
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    amountAppropriated: number;

    @ApiProperty({
        description: 'The total estimated cost of the project.',
        example: 75000000.00,
        type: 'number',
    })
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    totalCost: number;

    @ApiProperty({
        description: 'The currency used for the budget (e.g., NGN, USD, EUR). Defaults to NGN.',
        example: 'NGN',
        default: 'NGN',
    })
    @IsString()
    @IsIn(['NGN', 'USD', 'EUR', 'GBP']) // Example of restricting currency values
    @IsOptional() // Set to optional since the entity has a default value
    currency?: string = 'NGN';

    @ApiProperty({
        description: 'Details about the foreign component of the project funding/execution.',
        example: '30% financed by World Bank grant.',
    })
    @IsString()
    @IsNotEmpty()
    foreignComponent: string;

    @ApiProperty({
        description: 'The primary source of funding for the project.',
        example: 'Federal Government Allocation',
    })
    @IsString()
    @IsNotEmpty()
    fundingSource: string;

    @ApiProperty({
        description: 'The classification or type of project (e.g., Infrastructure, IT, Research).',
        example: 'IT Transformation',
    })
    @IsString()
    @IsNotEmpty()
    projectType: string;

    @ApiProperty({
        description: 'The initial status of the project.',
        example: 'Planning',
    })
    @IsString()
    @IsNotEmpty()
    status: string;

    milestones: CreateMilestoneDto[]; // Include Milestones
    comments: CreateCommentDto[];     // Include Comments
    // challenges: ChallengeDto[]; // Existing
    //recommendations: RecommendationDto[]; // Existing
}
