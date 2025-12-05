import { IsString, IsNotEmpty, IsDateString, IsInt, Min, Max, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMilestoneDto {
    @ApiProperty({ description: 'The description of the milestone.' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'The planned completion date (ISO 8601).', required: false })
    @IsDateString()
    plannedDate?: Date;

    @ApiProperty({ description: 'The UUID of the project this milestone belongs to.' })
    @IsUUID()
    @IsNotEmpty()
    projectId: string;
}