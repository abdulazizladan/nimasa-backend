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
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { DeliverablesService } from './deliverables.service';
import { DeliverableCategory } from './entities/strategic-deliverable.entity';
import { CreateMonthlySubmissionDto } from './DTO/create-monthly-submission.dto';
import { UpdateMonthlySubmissionDto } from './DTO/update-monthly-submission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CategoryDeliverablesController } from './category-deliverables.controller';

/**
 * Agency deliverables: owned by a department or by the organization as a whole (no ministry).
 * Deliverable CRUD comes from CategoryDeliverablesController; this controller also serves the
 * priority areas shared by all deliverables pages.
 */
@ApiTags('Agency Deliverables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('agency-deliverables')
export class AgencyDeliverablesController extends CategoryDeliverablesController {
    protected readonly categories = [DeliverableCategory.AGENCY];
    protected readonly defaultCategory = DeliverableCategory.AGENCY;

    constructor(deliverablesService: DeliverablesService) {
        super(deliverablesService);
    }

    // Priority areas (shared by the presidential, ministerial and agency pages).
    // Declared here so they are routed before the inherited GET/PATCH/DELETE ':id'.
    // Priority areas come in two lists: 'national' (presidential and ministerial, the default) and 'agency'
    @Post('priority-areas')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Create a new priority area' })
    @ApiBody({ schema: { properties: { name: { type: 'string' }, scope: { type: 'string', enum: ['national', 'agency'] } } } })
    createPriorityArea(@Body('name') name: string, @Body('scope') scope?: string) {
        return this.deliverablesService.createPriorityArea(name, scope);
    }

    @Get('priority-areas')
    @Roles(Role.admin, Role.guest)
    @ApiOperation({ summary: 'Get the priority areas in one list' })
    @ApiQuery({ name: 'scope', required: false, enum: ['national', 'agency'] })
    findAllPriorityAreas(@Query('scope') scope?: string) {
        return this.deliverablesService.findAllPriorityAreas(scope);
    }

    @Patch('priority-areas/:id')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Update a priority area' })
    updatePriorityArea(@Param('id') id: string, @Body('name') name: string) {
        return this.deliverablesService.updatePriorityArea(id, name);
    }

    @Delete('priority-areas/:id')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Delete a priority area' })
    removePriorityArea(@Param('id') id: string) {
        return this.deliverablesService.removePriorityArea(id);
    }

    @Get('summary')
    @Roles(Role.admin, Role.guest)
    @ApiOperation({ summary: 'Get summary statistics' })
    getSummary() {
        return this.deliverablesService.getSummary();
    }

    // Monthly submission endpoints (kept for compatibility; the deliverables pages use /quarterly-reports)
    @Post(':id/submissions')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Create a monthly submission for a deliverable' })
    createSubmission(
        @Param('id') id: string,
        @Body() createSubmissionDto: CreateMonthlySubmissionDto
    ) {
        return this.deliverablesService.createSubmission(id, createSubmissionDto);
    }

    @Get(':id/submissions')
    @Roles(Role.admin, Role.guest)
    @ApiOperation({ summary: 'Get all monthly submissions for a deliverable' })
    getSubmissions(@Param('id') id: string) {
        return this.deliverablesService.getSubmissions(id);
    }

    @Get(':id/submissions/:year/:month')
    @Roles(Role.admin, Role.guest)
    @ApiOperation({ summary: 'Get a specific monthly submission' })
    getSubmission(
        @Param('id') id: string,
        @Param('year') year: number,
        @Param('month') month: number
    ) {
        return this.deliverablesService.getSubmission(id, +year, +month);
    }

    @Patch('submissions/:submissionId')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Update a monthly submission' })
    updateSubmission(
        @Param('submissionId') submissionId: string,
        @Body() updateSubmissionDto: UpdateMonthlySubmissionDto
    ) {
        return this.deliverablesService.updateSubmission(submissionId, updateSubmissionDto);
    }

    @Delete('submissions/:submissionId')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Delete a monthly submission' })
    removeSubmission(@Param('submissionId') submissionId: string) {
        return this.deliverablesService.removeSubmission(submissionId);
    }
}
