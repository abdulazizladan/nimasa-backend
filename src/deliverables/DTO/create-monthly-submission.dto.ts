import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID, Min, Max } from 'class-validator';

export class CreateMonthlySubmissionDto {
    @ApiProperty()
    @IsUUID()
    deliverableId: string;

    @ApiProperty()
    @IsNumber()
    year: number;

    @ApiProperty({ minimum: 1, maximum: 12 })
    @IsNumber()
    @Min(1)
    @Max(12)
    month: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    actualValue?: number;

    @ApiProperty({ description: 'Milestones achieved during this month' })
    @IsString()
    progress: string;

    @ApiProperty({ description: 'Challenges faced during this month' })
    @IsString()
    keyIssues: string;

    @ApiProperty({ description: "MDA's efforts to resolve the issues" })
    @IsString()
    mdaEfforts: string;

    @ApiProperty({ description: 'Support required from stakeholders' })
    @IsString()
    comments: string;
}
