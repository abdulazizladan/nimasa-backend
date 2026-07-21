import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliverablesService } from './deliverables.service';
import { StrategicDeliverable, DeliverableCategory } from './entities/strategic-deliverable.entity';
import { CreateDeliverableDto } from './DTO/create-deliverable.dto';
import { UpdateDeliverableDto } from './DTO/update-deliverable.dto';
import { QueryDeliverablesDto } from './DTO/query-deliverables.dto';
import { CreateMonthlySubmissionDto } from './DTO/create-monthly-submission.dto';
import { UpdateMonthlySubmissionDto } from './DTO/update-monthly-submission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Agency Deliverables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('agency-deliverables')
export class DeliverablesController {
    @Post('priority-areas')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Create a new priority area' })
    createPriorityArea(@Body('name') name: string) {
        return this.deliverablesService.createPriorityArea(name);
    }

    @Get('priority-areas')
    @Roles(Role.admin, Role.director, Role.manager, Role.guest)
    @ApiOperation({ summary: 'Get all priority areas' })
    findAllPriorityAreas() {
        return this.deliverablesService.findAllPriorityAreas();
    }

    @Patch('priority-areas/:id')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Update a priority area' })
    updatePriorityArea(@Param('id') id: string, @Body('name') name: string) {
        return this.deliverablesService.updatePriorityArea(id, name);
    }

    @Delete('priority-areas/:id')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Delete a priority area' })
    removePriorityArea(@Param('id') id: string) {
        return this.deliverablesService.removePriorityArea(id);
    }

    constructor(private readonly deliverablesService: DeliverablesService) { }

    @Post()
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Create a new deliverable' })
    create(@Body() createDeliverableDto: CreateDeliverableDto) {
        return this.deliverablesService.create(createDeliverableDto, DeliverableCategory.AGENCY);
    }

    @Get()
    @Roles(Role.admin, Role.director, Role.manager, Role.guest)
    @ApiOperation({ summary: 'Get all deliverables with optional filters' })
    findAll(@Query() query: QueryDeliverablesDto) {
        return this.deliverablesService.findAll(query, DeliverableCategory.AGENCY);
    }

    @Get('summary')
    @Roles(Role.admin, Role.director, Role.manager, Role.guest)
    @ApiOperation({ summary: 'Get summary statistics' })
    getSummary() {
        return this.deliverablesService.getSummary();
    }

    @Get(':id')
    @Roles(Role.admin, Role.director, Role.manager, Role.guest)
    @ApiOperation({ summary: 'Get a deliverable by ID' })
    findOne(@Param('id') id: string) {
        return this.deliverablesService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Update a deliverable' })
    update(@Param('id') id: string, @Body() updateDeliverableDto: UpdateDeliverableDto) {
        return this.deliverablesService.update(id, updateDeliverableDto);
    }

    @Delete(':id')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Delete a deliverable' })
    remove(@Param('id') id: string) {
        return this.deliverablesService.remove(id);
    }

    // Monthly Submission Endpoints
    @Post(':id/submissions')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Create a monthly submission for a deliverable' })
    createSubmission(
        @Param('id') id: string,
        @Body() createSubmissionDto: CreateMonthlySubmissionDto
    ) {
        return this.deliverablesService.createSubmission(id, createSubmissionDto);
    }

    @Get(':id/submissions')
    @Roles(Role.admin, Role.director, Role.manager, Role.guest)
    @ApiOperation({ summary: 'Get all monthly submissions for a deliverable' })
    getSubmissions(@Param('id') id: string) {
        return this.deliverablesService.getSubmissions(id);
    }

    @Get(':id/submissions/:year/:month')
    @Roles(Role.admin, Role.director, Role.manager, Role.guest)
    @ApiOperation({ summary: 'Get a specific monthly submission' })
    getSubmission(
        @Param('id') id: string,
        @Param('year') year: number,
        @Param('month') month: number
    ) {
        return this.deliverablesService.getSubmission(id, +year, +month);
    }

    @Patch('submissions/:submissionId')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Update a monthly submission' })
    updateSubmission(
        @Param('submissionId') submissionId: string,
        @Body() updateSubmissionDto: UpdateMonthlySubmissionDto
    ) {
        return this.deliverablesService.updateSubmission(submissionId, updateSubmissionDto);
    }

    @Delete('submissions/:submissionId')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Delete a monthly submission' })
    removeSubmission(@Param('submissionId') submissionId: string) {
        return this.deliverablesService.removeSubmission(submissionId);
    }
}
