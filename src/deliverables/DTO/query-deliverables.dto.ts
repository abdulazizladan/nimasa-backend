import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDeliverablesDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ministry?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    priorityArea?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    responsibleDepartment?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    year?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;
}
