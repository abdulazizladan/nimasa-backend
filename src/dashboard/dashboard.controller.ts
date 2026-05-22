import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Dashboard')
@Controller('dashboard')
// Temporarily removing guard if not globally applied, or we can use it depending on existing structure.
// Most endpoints in this app seem to require authentication, but let's check auth.
// We'll apply JwtAuthGuard to be safe.
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(Role.admin, Role.director, Role.manager, Role.guest)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiOkResponse({
    description: 'Returns counts for users, presidential priorities, ministerial deliverables, and agency KPIs.',
    schema: {
      type: 'object',
      properties: {
        users: { type: 'number' },
        presidentialPriorities: { type: 'number' },
        ministerialDeliverables: { type: 'number' },
        agencyKPIs: { type: 'number' },
      }
    }
  })
  async getStats() {
    return this.dashboardService.getStats();
  }
}
