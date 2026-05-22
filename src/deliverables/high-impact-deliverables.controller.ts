import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeliverablesService } from './deliverables.service';
import { DeliverableCategory } from './entities/strategic-deliverable.entity';
import { CreateDeliverableDto } from './DTO/create-deliverable.dto';
import { UpdateDeliverableDto } from './DTO/update-deliverable.dto';
import { QueryDeliverablesDto } from './DTO/query-deliverables.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Presidential Priorities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('presidential-priorities')
export class PresidentialPrioritiesController {
    constructor(private readonly deliverablesService: DeliverablesService) { }

    @Post()
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Create a new high impact deliverable' })
    create(@Body() createDeliverableDto: CreateDeliverableDto) {
        return this.deliverablesService.create(createDeliverableDto, DeliverableCategory.PRESIDENTIAL_PRIORITY);
    }

    @Get()
    @Roles(Role.admin, Role.director, Role.manager, Role.guest)
    @ApiOperation({ summary: 'Get all high impact deliverables' })
    findAll(@Query() query: QueryDeliverablesDto) {
        return this.deliverablesService.findAll(query, DeliverableCategory.PRESIDENTIAL_PRIORITY);
    }

    @Patch(':id')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Update a high impact deliverable' })
    update(@Param('id') id: string, @Body() updateDeliverableDto: UpdateDeliverableDto) {
        return this.deliverablesService.update(id, updateDeliverableDto);
    }
}
