import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationDto } from './create-organization.dto';
import { IsOptional, IsBoolean } from 'class-validator';

// PartialType makes all fields optional based on CreateOrganizationDto
export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  
  // Exclude 'code' from being updated as it's the primary key/unique identifier.
  // The PartialType includes it, but the service logic will ignore it.
}
