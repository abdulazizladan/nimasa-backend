import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UsePipes, ValidationPipe, BadRequestException } from '@nestjs/common';
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

/** Presidential priorities include deliverables that are both ministerial and presidential. */
const PRESIDENTIAL_CATEGORIES = [DeliverableCategory.PRESIDENTIAL_PRIORITY, DeliverableCategory.BOTH];

@ApiTags('Presidential Priorities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('presidential-priorities')
export class PresidentialPrioritiesController {
    constructor(private readonly deliverablesService: DeliverablesService) { }

    @Post()
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Create a new presidential priority' })
    async create(@Body() createDeliverableDto: CreateDeliverableDto) {
        const { category, ...dto } = createDeliverableDto;
        this.assertPresidentialCategory(category);
        await this.deliverablesService.assertUniqueSerial(dto.serialNumber, PRESIDENTIAL_CATEGORIES);
        return this.deliverablesService.create(dto, category ?? DeliverableCategory.PRESIDENTIAL_PRIORITY);
    }

    @Get()
    @Roles(Role.admin, Role.director, Role.manager, Role.guest)
    @ApiOperation({ summary: 'Get all presidential priorities' })
    findAll(@Query() query: QueryDeliverablesDto) {
        return this.deliverablesService.findAll(query, PRESIDENTIAL_CATEGORIES);
    }

    @Get(':id')
    @Roles(Role.admin, Role.director, Role.manager, Role.guest)
    @ApiOperation({ summary: 'Get a presidential priority by ID' })
    findOne(@Param('id') id: string) {
        return this.deliverablesService.findOneInCategories(id, PRESIDENTIAL_CATEGORIES);
    }

    @Patch(':id')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Update a presidential priority' })
    async update(@Param('id') id: string, @Body() body: UpdateDeliverableDto) {
        // yearlyPerformance is maintained from quarterly reports; don't let an edit overwrite it
        const { yearlyPerformance, ...updateDeliverableDto } = body;
        this.assertPresidentialCategory(updateDeliverableDto.category);
        const existing = await this.deliverablesService.findOneInCategories(id, PRESIDENTIAL_CATEGORIES);
        if (updateDeliverableDto.serialNumber !== undefined && updateDeliverableDto.serialNumber !== existing.serialNumber) {
            await this.deliverablesService.assertUniqueSerial(updateDeliverableDto.serialNumber, PRESIDENTIAL_CATEGORIES, id);
        }
        return this.deliverablesService.update(id, updateDeliverableDto);
    }

    @Delete(':id')
    @Roles(Role.admin, Role.director, Role.manager)
    @ApiOperation({ summary: 'Delete a presidential priority' })
    async remove(@Param('id') id: string) {
        await this.deliverablesService.findOneInCategories(id, PRESIDENTIAL_CATEGORIES);
        return this.deliverablesService.remove(id);
    }

    private assertPresidentialCategory(category?: DeliverableCategory) {
        if (category && !PRESIDENTIAL_CATEGORIES.includes(category)) {
            throw new BadRequestException('Category must be PRESIDENTIAL_PRIORITY or BOTH.');
        }
    }
}
