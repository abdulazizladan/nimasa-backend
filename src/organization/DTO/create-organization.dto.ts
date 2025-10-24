import { IsNotEmpty, IsString, Length, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Unique identifier code for the organization (e.g., "ACME", "GLOB").',
    minLength: 3,
    maxLength: 10,
    example: 'GLOB',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 10, { message: 'Code must be between 3 and 10 characters.' })
  code: string;

  @ApiProperty({
    description: 'Full official name of the organization.',
    minLength: 5,
    maxLength: 150,
    example: 'Global Logistics Corporation',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 150)
  name: string;

  @ApiProperty({
    description: 'The mission statement or motto of the organization.',
    required: false,
    example: 'Moving the world, one package at a time.',
  })
  @IsString()
  @IsOptional()
  motto?: string;

  @ApiProperty({
    description: 'Publicly accessible URL for the organization\'s logo image.',
    required: false,
    format: 'url',
    example: 'https://images.example.com/globcorp/logo.png',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Logo must be a valid URL.' })
  logo?: string;
}
