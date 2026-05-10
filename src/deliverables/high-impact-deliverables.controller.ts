import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliverablesService } from './deliverables.service';
import { DeliverableCategory } from './entities/strategic-deliverable.entity';
import { CreateDeliverableDto } from './DTO/create-deliverable.dto';
import { UpdateDeliverableDto } from './DTO/update-deliverable.dto';
import { QueryDeliverablesDto } from './DTO/query-deliverables.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Presidential Priorities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('presidential-priorities')
export class PresidentialPrioritiesController {
    constructor(private readonly deliverablesService: DeliverablesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new high impact deliverable' })
    create(@Body() createDeliverableDto: CreateDeliverableDto) {
        return this.deliverablesService.create(createDeliverableDto, DeliverableCategory.PRESIDENTIAL_PRIORITY);
    }

    @Get()
    @ApiOperation({ summary: 'Get all high impact deliverables' })
    findAll(@Query() query: QueryDeliverablesDto) {
        return this.deliverablesService.findAll(query, DeliverableCategory.PRESIDENTIAL_PRIORITY);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a high impact deliverable' })
    update(@Param('id') id: string, @Body() updateDeliverableDto: UpdateDeliverableDto) {
        return this.deliverablesService.update(id, updateDeliverableDto);
    }
}
