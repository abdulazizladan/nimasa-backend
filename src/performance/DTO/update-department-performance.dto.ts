import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentPerformanceDto } from './create-department-performance.dto';

export class UpdateDepartmentPerformanceDto extends PartialType(CreateDepartmentPerformanceDto) {}
