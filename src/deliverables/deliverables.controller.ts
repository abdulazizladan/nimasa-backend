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
import { CreateDeliverableDto } from './DTO/create-deliverable.dto';
import { UpdateDeliverableDto } from './DTO/update-deliverable.dto';
import { QueryDeliverablesDto } from './DTO/query-deliverables.dto';
import { CreateMonthlySubmissionDto } from './DTO/create-monthly-submission.dto';
import { UpdateMonthlySubmissionDto } from './DTO/update-monthly-submission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Deliverables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('deliverables')
export class DeliverablesController {
    constructor(private readonly deliverablesService: DeliverablesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new deliverable' })
    create(@Body() createDeliverableDto: CreateDeliverableDto) {
        return this.deliverablesService.create(createDeliverableDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all deliverables with optional filters' })
    findAll(@Query() query: QueryDeliverablesDto) {
        return this.deliverablesService.findAll(query);
    }

    @Get('summary')
    @ApiOperation({ summary: 'Get summary statistics' })
    getSummary() {
        return this.deliverablesService.getSummary();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a deliverable by ID' })
    findOne(@Param('id') id: string) {
        return this.deliverablesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a deliverable' })
    update(@Param('id') id: string, @Body() updateDeliverableDto: UpdateDeliverableDto) {
        return this.deliverablesService.update(id, updateDeliverableDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a deliverable' })
    remove(@Param('id') id: string) {
        return this.deliverablesService.remove(id);
    }

    // Monthly Submission Endpoints
    @Post(':id/submissions')
    @ApiOperation({ summary: 'Create a monthly submission for a deliverable' })
    createSubmission(
        @Param('id') id: string,
        @Body() createSubmissionDto: CreateMonthlySubmissionDto
    ) {
        return this.deliverablesService.createSubmission(id, createSubmissionDto);
    }

    @Get(':id/submissions')
    @ApiOperation({ summary: 'Get all monthly submissions for a deliverable' })
    getSubmissions(@Param('id') id: string) {
        return this.deliverablesService.getSubmissions(id);
    }

    @Get(':id/submissions/:year/:month')
    @ApiOperation({ summary: 'Get a specific monthly submission' })
    getSubmission(
        @Param('id') id: string,
        @Param('year') year: number,
        @Param('month') month: number
    ) {
        return this.deliverablesService.getSubmission(id, +year, +month);
    }

    @Patch('submissions/:submissionId')
    @ApiOperation({ summary: 'Update a monthly submission' })
    updateSubmission(
        @Param('submissionId') submissionId: string,
        @Body() updateSubmissionDto: UpdateMonthlySubmissionDto
    ) {
        return this.deliverablesService.updateSubmission(submissionId, updateSubmissionDto);
    }

    @Delete('submissions/:submissionId')
    @ApiOperation({ summary: 'Delete a monthly submission' })
    removeSubmission(@Param('submissionId') submissionId: string) {
        return this.deliverablesService.removeSubmission(submissionId);
    }
}
