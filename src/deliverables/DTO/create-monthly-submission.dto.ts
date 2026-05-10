import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';

export class CreateMonthlySubmissionDto {
    @ApiProperty()
    @IsUUID()
    deliverableId: string;

    @ApiProperty()
    @IsNumber()
    year: number;

    @ApiProperty({ minimum: 1, maximum: 12, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(12)
    month?: number;

    @ApiProperty({ required: false, enum: ['Q1', 'Q2', 'Q3', 'Q4'] })
    @IsOptional()
    @IsString()
    quarter?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    actualValue?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    targetValue?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    supportingDocType?: string;

    @ApiProperty({ description: 'Milestones achieved during this month/quarter', required: false })
    @IsOptional()
    @IsString()
    progress?: string;

    @ApiProperty({ description: 'Challenges faced during this month/quarter', required: false })
    @IsOptional()
    @IsString()
    keyIssues?: string;

    @ApiProperty({ description: "MDA's efforts to resolve the issues", required: false })
    @IsOptional()
    @IsString()
    mdaEfforts?: string;

    @ApiProperty({ description: 'Support required from stakeholders', required: false })
    @IsOptional()
    @IsString()
    comments?: string;
}
