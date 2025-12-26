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
    @IsString()
    baselineType: string;

    @ApiProperty()
    @IsString()
    indicator: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    baseline2023?: number;

    // Quarterly fields (all optional)
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    q1_2024_target?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    q1_2024_actual?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    q2_2024_target?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    q2_2024_actual?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    q3_2024_target?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    q3_2024_actual?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    q4_2024_target?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    q4_2024_actual?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    annual_2024_target?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    target_2025?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    target_2026?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    target_2027?: number;

    @ApiProperty()
    @IsString()
    responsibleDepartment: string;

    @ApiProperty()
    @IsString()
    supportingEvidence: string;
}
