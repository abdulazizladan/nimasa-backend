import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';
import { IsOptional, IsString } from 'class-validator';

// PartialType makes all fields optional based on CreateDepartmentDto
export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  // We explicitly make the foreign key relationship optional here, 
  // though typically you wouldn't change a department's parent organization via a simple update.
  @IsOptional()
  @IsString()
  organizationCode?: string;
}
 