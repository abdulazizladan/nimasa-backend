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

/**
 * CRUD for one family of strategic deliverables (presidential or ministerial). Each family sees its
 * own category plus BOTH ("Ministerial and Presidential"), so shared deliverables appear in both lists.
 * Subclasses supply the route, guards and categories.
 */
export abstract class CategoryDeliverablesController {
    /** Categories this endpoint lists and manages */
    protected abstract readonly categories: DeliverableCategory[];
    /** Category given to new deliverables when none is chosen */
    protected abstract readonly defaultCategory: DeliverableCategory;

    constructor(protected readonly deliverablesService: DeliverablesService) { }

    @Post()
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Create a deliverable' })
    async create(@Body() createDeliverableDto: CreateDeliverableDto) {
        const { category, ...dto } = createDeliverableDto;
        this.assertCategory(category);
        // The serial number is assigned automatically
        return this.deliverablesService.create(dto, category ?? this.defaultCategory);
    }

    @Get()
    @Roles(Role.admin, Role.guest)
    @ApiOperation({ summary: 'List deliverables' })
    findAll(@Query() query: QueryDeliverablesDto) {
        return this.deliverablesService.findAll(query, this.categories);
    }

    @Get(':id')
    @Roles(Role.admin, Role.guest)
    @ApiOperation({ summary: 'Get a deliverable by ID, with its quarterly reports' })
    findOne(@Param('id') id: string) {
        return this.deliverablesService.findOneInCategories(id, this.categories);
    }

    @Patch(':id')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Update a deliverable' })
    async update(@Param('id') id: string, @Body() body: UpdateDeliverableDto) {
        // yearlyPerformance is maintained from quarterly reports; don't let an edit overwrite it
        const { yearlyPerformance, ...updateDeliverableDto } = body;
        this.assertCategory(updateDeliverableDto.category);
        await this.deliverablesService.findOneInCategories(id, this.categories);
        return this.deliverablesService.update(id, updateDeliverableDto);
    }

    @Delete(':id')
    @Roles(Role.admin)
    @ApiOperation({ summary: 'Delete a deliverable and its quarterly reports' })
    async remove(@Param('id') id: string) {
        await this.deliverablesService.findOneInCategories(id, this.categories);
        return this.deliverablesService.remove(id);
    }

    private assertCategory(category?: DeliverableCategory) {
        if (category && !this.categories.includes(category)) {
            throw new BadRequestException(`Category must be one of: ${this.categories.join(', ')}.`);
        }
    }
}

@ApiTags('Presidential Priorities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('presidential-priorities')
export class PresidentialPrioritiesController extends CategoryDeliverablesController {
    protected readonly categories = [DeliverableCategory.PRESIDENTIAL_PRIORITY, DeliverableCategory.BOTH];
    protected readonly defaultCategory = DeliverableCategory.PRESIDENTIAL_PRIORITY;

    constructor(deliverablesService: DeliverablesService) {
        super(deliverablesService);
    }
}

@ApiTags('Ministerial Deliverables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('ministerial-deliverables/deliverables')
export class MinisterialDeliverablesController extends CategoryDeliverablesController {
    protected readonly categories = [DeliverableCategory.MINISTERIAL, DeliverableCategory.BOTH];
    protected readonly defaultCategory = DeliverableCategory.MINISTERIAL;

    constructor(deliverablesService: DeliverablesService) {
        super(deliverablesService);
    }
}
