import { PartialType } from '@nestjs/mapped-types';
import { CreateMilestoneDto } from "./create-milestone.dto";
import { IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMilestoneDto extends PartialType(CreateMilestoneDto) {
    
    @ApiProperty({ description: 'The actual completion date (ISO 8601).', required: false })
    @IsOptional()
    @IsDateString()
    actualDate?: Date;

    @ApiProperty({ description: 'The current progress percentage (0-100).', type: 'number', minimum: 0, maximum: 100, required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(100)
    progressPercentage?: number;
}