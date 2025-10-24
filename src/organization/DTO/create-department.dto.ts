import { IsNotEmpty, IsString, Length, IsOptional, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Unique, short code for the department (e.g., "HR", "ENG").',
    minLength: 2,
    maxLength: 20,
    example: 'SALES',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20, { message: 'Department code must be between 2 and 20 characters.' })
  code: string;

  @ApiProperty({
    description: 'Full name of the department.',
    minLength: 5,
    maxLength: 100,
    example: 'Global Sales and Marketing',
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  name: string;

  @ApiProperty({
    description: 'A brief description of the department\'s primary function.',
    required: false,
    example: 'Responsible for driving revenue and client acquisition.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Name of the department head or manager.',
    minLength: 3,
    maxLength: 50,
    example: 'Jane Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  head: string;

  @ApiProperty({
    description: 'Email address of the director, if applicable.',
    required: false,
    format: 'email',
    example: 'jane.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  directorEmail?: string;

  @ApiProperty({
    description: 'Contact phone number for the department.',
    required: false,
    example: '+15551234567',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?\d{8,20}$/, { message: 'Contact phone must be a valid international or local number.' })
  contactPhone?: string;

  @ApiProperty({
    description: 'The unique code of the parent Organization this department belongs to.',
    minLength: 3,
    maxLength: 10,
    example: 'ACME',
  })
  // Field to link to the parent Organization
  @IsString()
  @IsNotEmpty()
  @Length(3, 10, { message: 'Organization code must be between 3 and 10 characters.' })
  organizationCode: string;
}
