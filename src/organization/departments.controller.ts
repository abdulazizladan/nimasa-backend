import { Controller, Get, Post, Body, Patch, Param, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateDepartmentDto } from './DTO/create-department.dto';
import { UpdateDepartmentDto } from './DTO/update-department.dto';
import { Department } from './entities/department.entity';

@ApiTags('Departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all departments' })
  @ApiResponse({ status: 200, description: 'List of departments.', type: [Department] })
  findAllDepartments(): Promise<Department[]> {
    return this.organizationService.findAllDepartments();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new department under an existing organization' })
  @ApiBody({ type: CreateDepartmentDto, description: 'Requires an existing organizationCode.' })
  @ApiResponse({ status: 201, description: 'Department successfully created.', type: Department })
  @ApiResponse({ status: 404, description: 'Organization not found (Invalid organizationCode).' })
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.organizationService.createDepartment(createDepartmentDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single department by its ID' })
  @ApiParam({ name: 'id', description: 'UUID of the department' })
  @ApiResponse({ status: 200, description: 'The found department.', type: Department })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  findOneDepartment(
    @Param('id', ParseUUIDPipe) id: string, // Validate ID as UUID
  ): Promise<Department> {
    return this.organizationService.findOneDepartment(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing department' })
  @ApiParam({ name: 'id', description: 'UUID of the department to update' })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiResponse({ status: 200, description: 'The successfully updated department.', type: Department })
  @ApiResponse({ status: 404, description: 'Department or Organization not found.' })
  updateDepartment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.organizationService.updateDepartment(id, updateDepartmentDto);
  }
}
