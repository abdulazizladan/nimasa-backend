import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ description: 'The content of the project update/comment.' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ description: 'The author of the comment (e.g., department name).', required: false })
    @IsString()
    @IsOptional()
    author?: string; // Could be a User ID in a real application

    @ApiProperty({ description: 'The UUID of the project this comment belongs to.' })
    @IsUUID()
    @IsNotEmpty()
    projectId: string;
}