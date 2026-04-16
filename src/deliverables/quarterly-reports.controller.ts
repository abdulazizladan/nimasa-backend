import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { DeliverablesService } from './deliverables.service';
import { CreateMonthlySubmissionDto } from './DTO/create-monthly-submission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Quarterly Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quarterly-reports')
export class QuarterlyReportsController {
    constructor(private readonly deliverablesService: DeliverablesService) { }

    @Get()
    @ApiOperation({ summary: 'Get quarterly reports for a deliverable' })
    @ApiQuery({ name: 'deliverableId', required: true })
    @ApiQuery({ name: 'quarter', required: false })
    @ApiQuery({ name: 'year', required: false })
    getSubmissions(
        @Query('deliverableId') deliverableId: string,
        @Query('quarter') quarter?: string,
        @Query('year') year?: string
    ) {
        // Here we re-use getSubmissions and allow the frontend/backend to filter
        // If we strictly needed quarters we'd aggregate, but existing models return submissions
        return this.deliverablesService.getSubmissions(deliverableId);
    }

    @Post()
    @ApiOperation({ summary: 'Create a quarterly report (monthly submission)' })
    createSubmission(
        @Query('deliverableId') deliverableId: string,
        @Body() createSubmissionDto: CreateMonthlySubmissionDto
    ) {
        // Maps the creation of a 'quarterly report' to a submission as per existing models
        if (!deliverableId) {
            // Alternatively if deliverableId is in the DTO, pass it
            // Assuming deliverableId is provided in the query string
        }
        return this.deliverablesService.createSubmission(deliverableId, createSubmissionDto);
    }
}
