import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

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
    yearlyPerformance?: Record<string, any>;

    @ApiProperty({ required: false })
    @IsOptional()
    projections?: Record<string, number>;

    @ApiProperty()
    @IsString()
    responsibleDepartment: string;

    @ApiProperty()
    @IsString()
    supportingEvidence: string;
}
