import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PresidentialPriorityArea } from '../deliverables/entities/presidential-priority.entity';
import { StrategicDeliverable } from '../deliverables/entities/strategic-deliverable.entity';
import { KPI } from '../organization/entities/kpi.entity';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PresidentialPriorityArea)
    private readonly presidentialPriorityRepository: Repository<PresidentialPriorityArea>,
    @InjectRepository(StrategicDeliverable)
    private readonly deliverableRepository: Repository<StrategicDeliverable>,
    @InjectRepository(KPI)
    private readonly kpiRepository: Repository<KPI>,
  ) {}

  async getStats() {
    const [
      users,
      presidentialPriorities,
      ministerialDeliverables,
      agencyKPIs
    ] = await Promise.all([
      this.userRepository.count({ where: { role: In([Role.admin, Role.guest]) } }),
      this.presidentialPriorityRepository.count(),
      this.deliverableRepository.count(),
      this.kpiRepository.count(),
    ]);

    return {
      users,
      presidentialPriorities,
      ministerialDeliverables,
      agencyKPIs
    };
  }
}
