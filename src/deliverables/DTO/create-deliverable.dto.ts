import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsObject, IsInt, IsArray, IsIn, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DeliverableCategory, ANNUAL_AGGREGATIONS, AnnualAggregation } from '../entities/strategic-deliverable.entity';

export class AnnualTargetDto {
    @ApiProperty()
    @IsInt()
    @Min(2000)
    @Max(2100)
    baselineYear: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    baselineValue?: number | null;

    @ApiProperty()
    @IsInt()
    @Min(2000)
    @Max(2100)
    targetYear: number;

    @ApiProperty()
    @IsNumber()
    targetValue: number;
}

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

    @ApiProperty({ required: false, type: [AnnualTargetDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnnualTargetDto)
    annualTargets?: AnnualTargetDto[];

    @ApiProperty({ required: false, enum: ANNUAL_AGGREGATIONS, description: 'How quarterly results combine into the annual figure (default sum)' })
    @IsOptional()
    @IsIn(ANNUAL_AGGREGATIONS)
    annualAggregation?: AnnualAggregation;

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
