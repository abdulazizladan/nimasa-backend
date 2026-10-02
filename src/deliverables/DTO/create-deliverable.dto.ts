import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsObject } from 'class-validator';
import { DeliverableCategory } from '../entities/strategic-deliverable.entity';

export class CreateDeliverableDto {
    @ApiProperty()
    @IsNumber()
    serialNumber: number;

    @ApiProperty()
    @IsString()
    ministry: string;

    @ApiProperty()
    @IsString()
    priorityArea: string;

    @ApiProperty()
    @IsString()
    outcome: string;

    @ApiProperty()
    @IsString()
    deliverable: string;

    @ApiProperty()
    @IsNumber()
    baselineYear: number;

    @ApiProperty()
    @IsString()
    baselineType: string;

    @ApiProperty()
    @IsString()
    indicator: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    baseline2023?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsObject()
    yearlyPerformance?: Record<string, any>;

    @ApiProperty({ required: false, description: 'Annual targets keyed by year, e.g. { "2026": 80 }' })
    @IsOptional()
    @IsObject()
    projections?: Record<string, number>;

    @ApiProperty({ required: false, enum: DeliverableCategory })
    @IsOptional()
    @IsEnum(DeliverableCategory)
    category?: DeliverableCategory;

    @ApiProperty()
    @IsString()
    responsibleDepartment: string;

    @ApiProperty()
    @IsString()
    supportingEvidence: string;
}
