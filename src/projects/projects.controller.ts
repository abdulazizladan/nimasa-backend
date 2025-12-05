import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './DTOs/create-project.dto';
import { UpdateProjectDto } from './DTOs/update-project.dto';
import { ProjectDto } from './DTOs/project.dto';


@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {

    constructor(private readonly projectService: ProjectsService) {}

    // 1. CREATE: POST /projects
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new Project' })
    @ApiBody({
        description: 'Payload required to create a new Project',
        type: CreateProjectDto,
    })
    @ApiResponse({ 
        status: 201, 
        description: 'The Project has been successfully created.', 
        type: ProjectDto // Assuming you have a ProjectDto for response
    })
    @ApiResponse({ status: 400, description: 'Bad Request (Validation failure or missing related ID)' })
    async create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto);
    }

    // 2. READ All: GET /projects
    @Get()
    @ApiOperation({ summary: 'Retrieve all Projects' })
    @ApiResponse({ 
        status: 200, 
        description: 'List of all Projects.', 
        type: [ProjectDto] 
    })
    async findAll() {
        return this.projectService.findAll();
    }

    // 2. READ One: GET /projects/:id
    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific Project by ID' })
    @ApiParam({ 
        name: 'id', 
        description: 'The UUID of the Project', 
        type: 'string' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'The found Project.', 
        type: ProjectDto 
    })
    @ApiResponse({ status: 404, description: 'Project not found.' })
    async findOne(@Param('id') id: string) {
        return this.projectService.findOne(id);
    }

    // 3. UPDATE: PATCH /projects/:id
    @Patch(':id')
    @ApiOperation({ summary: 'Update a specific Project' })
    @ApiParam({ 
        name: 'id', 
        description: 'The UUID of the Project to update', 
        type: 'string' 
    })
    @ApiBody({
        description: 'Partial payload with the fields that need to be updated.',
        type: UpdateProjectDto,
    })
    @ApiResponse({ 
        status: 200, 
        description: 'The updated Project.', 
        type: ProjectDto 
    })
    @ApiResponse({ status: 404, description: 'Project not found.' })
    async update(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
    ) {
        return this.projectService.update(id, updateProjectDto);
    }

    // 4. DELETE: DELETE /projects/:id
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Use 204 No Content for successful deletion
    @ApiOperation({ summary: 'Delete a specific Project' })
    @ApiParam({ 
        name: 'id', 
        description: 'The UUID of the Project to delete', 
        type: 'string' 
    })
    @ApiResponse({ status: 204, description: 'Project successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Project not found.' })
    async remove(@Param('id') id: string) {
        await this.projectService.remove(id);
    }

}
