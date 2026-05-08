import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsObject } from 'class-validator';

export class CreatePerformanceBondKpiDto {
  @ApiProperty({ example: 'Enhance Infrastructure and Transportation' })
  @IsString()
  priorityArea: string;

  @ApiProperty({ example: 'Develop National Policy on Marine & Blue Economy' })
  @IsString()
  deliverable: string;

  @ApiProperty({ example: '% Completion of development Policy Document' })
  @IsString()
  indicator: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  baseline2023?: number;

  @ApiProperty({ example: 'Stakeholder review documents' })
  @IsString()
  @IsOptional()
  sourceOfEvidence?: string;

  @ApiProperty({ example: 'policy_draft.pdf' })
  @IsString()
  @IsOptional()
  evidenceFile?: string;

  @ApiProperty({ example: { '2024': { q1: { target: 15, actual: 10, cumulative: 20 } } } })
  @IsObject()
  @IsOptional()
  yearlyPerformance?: Record<string, any>;

  @ApiProperty({ example: { '2025': 100, '2026': 100 } })
  @IsObject()
  @IsOptional()
  projections?: Record<string, number>;
}

export class UpdatePerformanceBondKpiDto extends PartialType(CreatePerformanceBondKpiDto) {}
