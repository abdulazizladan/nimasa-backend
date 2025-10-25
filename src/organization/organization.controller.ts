import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger'; // Added Swagger imports
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './DTO/create-organization.dto';
import { UpdateOrganizationDto } from './DTO/update-organization.dto';
import { CreateDepartmentDto } from './DTO/create-department.dto';
import { UpdateDepartmentDto } from './DTO/update-department.dto';
import { Organization } from './entities/organization.entity';
import { Department } from './entities/department.entity';

@ApiTags('Organization & Departments') // Tag the whole controller for grouping in Swagger UI
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // ====================================================================
  // ORGANIZATION ENDPOINTS (/organization)
  // ====================================================================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiResponse({ status: 201, description: 'Organization successfully created.', type: Organization })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all organizations' })
  @ApiQuery({ 
    name: 'includeDepartments', 
    required: false, 
    type: 'boolean', 
    description: 'If true, related departments will be included in the response (default: false).',
  })
  @ApiResponse({ status: 200, description: 'List of organizations.', type: [Organization] })
  findAll(
    // Optional query parameter to include departments, defaults to false
    @Query('includeDepartments') includeDepartments?: string,
  ): Promise<Organization[]> {
    const shouldInclude = includeDepartments === 'true';
    return this.organizationService.findAll(shouldInclude);
  }

  @Get(':code')
  @ApiOperation({ summary: 'Retrieve a single organization by its unique code' })
  @ApiParam({ name: 'code', description: 'Unique code of the organization' })
  @ApiResponse({ status: 200, description: 'The found organization.', type: Organization })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  findOne(@Param('code') code: string): Promise<Organization> {
    return this.organizationService.findOne(code);
  }

  @Patch(':code')
  @ApiOperation({ summary: 'Update an existing organization' })
  @ApiParam({ name: 'code', description: 'Unique code of the organization to update' })
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiResponse({ status: 200, description: 'The successfully updated organization.', type: Organization })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  update(
    @Param('code') code: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.update(code, updateOrganizationDto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 status on successful deletion
  @ApiOperation({ summary: 'Delete an organization by its unique code' })
  @ApiParam({ name: 'code', description: 'Unique code of the organization to delete' })
  @ApiResponse({ status: 204, description: 'Organization successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Organization not found.' })
  remove(@Param('code') code: string): Promise<void> {
    return this.organizationService.remove(code);
  }

  // ====================================================================
  // DEPARTMENT ENDPOINTS (Nested Resource - /organization/department)
  // ====================================================================

  @Post('department')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new department under an existing organization' })
  @ApiBody({ type: CreateDepartmentDto, description: 'Requires an existing organizationCode.' })
  @ApiResponse({ status: 201, description: 'Department successfully created.', type: Department })
  @ApiResponse({ status: 404, description: 'Organization not found (Invalid organizationCode).' })
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.organizationService.createDepartment(createDepartmentDto);
  }

  @Get('department/:id')
  @ApiOperation({ summary: 'Retrieve a single department by its ID' })
  @ApiParam({ name: 'id', description: 'UUID of the department' })
  @ApiResponse({ status: 200, description: 'The found department.', type: Department })
  @ApiResponse({ status: 404, description: 'Department not found.' })
  findOneDepartment(
    @Param('id', ParseUUIDPipe) id: string, // Validate ID as UUID
  ): Promise<Department> {
    // The service method is findOneDepartment, but we map to a clear route
    return this.organizationService.findOneDepartment(id);
  }

  @Patch('department/:id')
  @ApiOperation({ summary: 'Update an existing department' })
  @ApiParam({ name: 'id', description: 'UUID of the department to update' })
  @ApiBody({ type: UpdateDepartmentDto })
  @ApiResponse({ status: 200, description: 'The successfully updated department.', type: Department })
  @ApiResponse({ status: 404, description: 'Department or Organization not found.' })
  updateDepartment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<Department> {
    // This uses the selected update logic from the service
    return this.organizationService.updateDepartment(id, updateDepartmentDto);
  }

  @Get('priorityAreas')
  @ApiOperation({ summary: 'Retrieve all priority areas' })
  getPriorityAreas() {
    this.organizationService.getPriorityAreas()
  }
}
