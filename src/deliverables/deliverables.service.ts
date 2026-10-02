import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { StrategicDeliverable, DeliverableCategory } from './entities/strategic-deliverable.entity';
import { DeliverableSubmission } from './entities/deliverable-submission.entity';
import { PresidentialPriorityArea } from './entities/presidential-priority.entity';
import { CreateDeliverableDto } from './DTO/create-deliverable.dto';
import { UpdateDeliverableDto } from './DTO/update-deliverable.dto';
import { QueryDeliverablesDto } from './DTO/query-deliverables.dto';
import { CreateMonthlySubmissionDto } from './DTO/create-monthly-submission.dto';
import { UpdateMonthlySubmissionDto } from './DTO/update-monthly-submission.dto';

@Injectable()
export class DeliverablesService {
    constructor(
        @InjectRepository(StrategicDeliverable)
        private readonly deliverableRepo: Repository<StrategicDeliverable>,
        @InjectRepository(DeliverableSubmission)
        private readonly monthlySubmissionRepo: Repository<DeliverableSubmission>,
        @InjectRepository(PresidentialPriorityArea)
        private readonly priorityAreaRepo: Repository<PresidentialPriorityArea>,
    ) { }

    async createPriorityArea(name: string): Promise<PresidentialPriorityArea> {
        if (!name || !name.trim()) {
            throw new BadRequestException('Priority Area name is required.');
        }
        const trimmedName = name.trim();
        const existing = await this.priorityAreaRepo.findOne({ where: { name: trimmedName } });
        if (existing) {
            throw new BadRequestException(`Priority Area "${trimmedName}" already exists.`);
        }
        const area = this.priorityAreaRepo.create({ name: trimmedName });
        return this.priorityAreaRepo.save(area);
    }

    async findAllPriorityAreas(): Promise<PresidentialPriorityArea[]> {
        return this.priorityAreaRepo.find({ order: { name: 'ASC' } });
    }

    async updatePriorityArea(id: string, name: string): Promise<PresidentialPriorityArea> {
        if (!name || !name.trim()) {
            throw new BadRequestException('Priority Area name is required.');
        }
        const trimmedName = name.trim();
        const area = await this.priorityAreaRepo.findOne({ where: { id } });
        if (!area) {
            throw new NotFoundException(`Priority Area with ID "${id}" not found.`);
        }
        
        // Check if another area has the same name
        const existing = await this.priorityAreaRepo.findOne({ where: { name: trimmedName } });
        if (existing && existing.id !== id) {
            throw new BadRequestException(`Priority Area "${trimmedName}" already exists.`);
        }

        area.name = trimmedName;
        return this.priorityAreaRepo.save(area);
    }

    async removePriorityArea(id: string): Promise<void> {
        const result = await this.priorityAreaRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Priority Area with ID "${id}" not found.`);
        }
    }

    async create(dto: CreateDeliverableDto, category: DeliverableCategory = DeliverableCategory.AGENCY): Promise<StrategicDeliverable> {
        const deliverable = this.deliverableRepo.create({ ...dto, category });
        return this.deliverableRepo.save(deliverable);
    }

    async findAll(
        query: QueryDeliverablesDto,
        category?: DeliverableCategory | DeliverableCategory[]
    ): Promise<StrategicDeliverable[]> {
        const qb = this.deliverableRepo.createQueryBuilder('d');

        if (Array.isArray(category)) {
            qb.andWhere('d.category IN (:...categories)', { categories: category });
        } else if (category) {
            qb.andWhere('d.category = :category', { category });
        }

        if (query.ministry) {
            qb.andWhere('d.ministry = :ministry', { ministry: query.ministry });
        }
        if (query.priorityArea) {
            qb.andWhere('d.priorityArea = :priorityArea', { priorityArea: query.priorityArea });
        }
        if (query.responsibleDepartment) {
            qb.andWhere('d.responsibleDepartment = :responsibleDepartment', {
                responsibleDepartment: query.responsibleDepartment,
            });
        }

        qb.orderBy('d.serialNumber', 'ASC');

        if (query.limit) {
            qb.limit(query.limit);
        }

        return qb.getMany();
    }

    async findOne(id: string): Promise<StrategicDeliverable> {
        const deliverable = await this.deliverableRepo.findOne({
            where: { id },
            relations: ['monthlySubmissions']
        });
        if (!deliverable) {
            throw new NotFoundException(`Deliverable with ID "${id}" not found`);
        }
        return deliverable;
    }

    /** Like findOne, but 404s if the deliverable is not in one of the given categories. */
    async findOneInCategories(id: string, categories: DeliverableCategory[]): Promise<StrategicDeliverable> {
        const deliverable = await this.findOne(id);
        if (!categories.includes(deliverable.category)) {
            throw new NotFoundException(`Deliverable with ID "${id}" not found`);
        }
        return deliverable;
    }

    /** Rejects a serial number already used by another deliverable in the same categories. */
    async assertUniqueSerial(
        serialNumber: number,
        categories: DeliverableCategory[],
        excludeId?: string
    ): Promise<void> {
        const existing = await this.deliverableRepo.findOne({
            where: { serialNumber, category: In(categories) },
        });
        if (existing && existing.id !== excludeId) {
            throw new BadRequestException(`Serial number ${serialNumber} is already in use.`);
        }
    }

    async update(id: string, dto: UpdateDeliverableDto): Promise<StrategicDeliverable> {
        const deliverable = await this.findOne(id);
        Object.assign(deliverable, dto);
        return this.deliverableRepo.save(deliverable);
    }

    async remove(id: string): Promise<void> {
        const result = await this.deliverableRepo.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Deliverable with ID "${id}" not found`);
        }
    }

    async getSummary() {
        const total = await this.deliverableRepo.count();
        const ministries = await this.deliverableRepo
            .createQueryBuilder('d')
            .select('DISTINCT d.ministry', 'ministry')
            .getRawMany();

        return {
            totalDeliverables: total,
            totalMinistries: ministries.length,
        };
    }

    // Monthly Submission Methods
    async createSubmission(
        deliverableId: string,
        dto: CreateMonthlySubmissionDto
    ): Promise<DeliverableSubmission> {
        console.log('Creating submission for deliverable:', deliverableId, 'with data:', dto);
        const deliverable = await this.deliverableRepo.findOne({ where: { id: deliverableId } });

        if (!deliverable) {
            console.error('Deliverable not found:', deliverableId);
            throw new NotFoundException(`Deliverable with ID "${deliverableId}" not found`);
        }

        // Check if submission already exists for this month/year or quarter/year
        const existingSubmission = await this.monthlySubmissionRepo.findOne({
            where: {
                deliverable: { id: deliverableId },
                year: dto.year,
                ...(dto.month ? { month: dto.month } : {}),
                ...(dto.quarter ? { quarter: dto.quarter } : {}),
            },
        });

        if (existingSubmission) {
            throw new BadRequestException(
                `Submission for ${dto.month || dto.quarter}/${dto.year} already exists. Use update instead.`
            );
        }

        const submission = this.monthlySubmissionRepo.create({
            deliverable,
            year: dto.year,
            month: dto.month,
            quarter: dto.quarter,
            actualValue: dto.actualValue,
            targetValue: dto.targetValue,
            supportingDocType: dto.supportingDocType,
            progress: dto.progress,
            keyIssues: dto.keyIssues,
            mdaEfforts: dto.mdaEfforts,
            comments: dto.comments,
        });

        const savedSubmission = await this.monthlySubmissionRepo.save(submission);

        // Sync to deliverable JSON for performance viewing
        if (!deliverable.yearlyPerformance) deliverable.yearlyPerformance = {};
        const year = dto.year.toString();
        if (!deliverable.yearlyPerformance[year]) deliverable.yearlyPerformance[year] = {};
        
        if (dto.quarter) {
            const qKey = dto.quarter.toLowerCase();
            deliverable.yearlyPerformance[year][qKey] = {
                target: dto.targetValue || 0,
                actual: dto.actualValue || 0
            };
        } else if (dto.month) {
            // For monthly, we might want to aggregate or just store
            // Let's store by month too if needed
            deliverable.yearlyPerformance[year][`m${dto.month}`] = {
                target: dto.targetValue || 0,
                actual: dto.actualValue || 0
            };
        }

        // Force TypeORM to recognize the change by reassigning the object reference
        deliverable.yearlyPerformance = { ...deliverable.yearlyPerformance };

        await this.deliverableRepo.save(deliverable);
        console.log('Successfully created submission and synced JSON');
        return savedSubmission;
    }

    async getSubmissions(deliverableId: string): Promise<DeliverableSubmission[]> {
        const deliverable = await this.deliverableRepo.findOne({ where: { id: deliverableId } });

        if (!deliverable) {
            throw new NotFoundException(`Deliverable with ID "${deliverableId}" not found`);
        }

        return this.monthlySubmissionRepo.find({
            where: { deliverable: { id: deliverableId } },
            order: { year: 'DESC', month: 'DESC' },
        });
    }

    async getSubmission(
        deliverableId: string,
        year: number,
        month: number
    ): Promise<DeliverableSubmission> {
        const deliverable = await this.deliverableRepo.findOne({ where: { id: deliverableId } });

        if (!deliverable) {
            throw new NotFoundException(`Deliverable with ID "${deliverableId}" not found`);
        }

        const submission = await this.monthlySubmissionRepo.findOne({
            where: {
                deliverable: { id: deliverableId },
                year,
                month,
            },
            relations: ['deliverable'],
        });

        if (!submission) {
            throw new NotFoundException(
                `Submission for ${month}/${year} not found`
            );
        }

        return submission;
    }

    async updateSubmission(
        submissionId: string,
        dto: UpdateMonthlySubmissionDto
    ): Promise<DeliverableSubmission> {
        const submission = await this.monthlySubmissionRepo.findOne({
            where: { id: submissionId },
            relations: ['deliverable'],
        });

        if (!submission) {
            throw new NotFoundException(
                `Submission with ID "${submissionId}" not found`
            );
        }

        const oldKey = this.performanceKey(submission);
        const oldYear = submission.year;
        const newYear = dto.year ?? submission.year;
        const newMonth = dto.month ?? submission.month;
        const newQuarter = dto.quarter ?? submission.quarter;

        // Moving a report to another period must not collide with an existing report
        if (newYear !== submission.year || newMonth !== submission.month || newQuarter !== submission.quarter) {
            const clash = await this.monthlySubmissionRepo.findOne({
                where: {
                    deliverable: { id: submission.deliverable.id },
                    year: newYear,
                    ...(newMonth ? { month: newMonth } : {}),
                    ...(newQuarter ? { quarter: newQuarter } : {}),
                },
            });
            if (clash && clash.id !== submission.id) {
                throw new BadRequestException(
                    `Submission for ${newMonth || newQuarter}/${newYear} already exists.`
                );
            }
        }

        Object.assign(submission, dto);
        const saved = await this.monthlySubmissionRepo.save(submission);

        await this.syncPerformance(submission.deliverable.id, (perf) => {
            if (oldKey && perf[oldYear]) {
                delete perf[oldYear][oldKey];
                if (Object.keys(perf[oldYear]).length === 0) delete perf[oldYear];
            }
            const newKey = this.performanceKey(saved);
            if (newKey) {
                const year = saved.year.toString();
                if (!perf[year]) perf[year] = {};
                perf[year][newKey] = { target: saved.targetValue || 0, actual: saved.actualValue || 0 };
            }
        });

        return saved;
    }

    async removeSubmission(submissionId: string): Promise<void> {
        const submission = await this.monthlySubmissionRepo.findOne({
            where: { id: submissionId },
            relations: ['deliverable'],
        });
        if (!submission) {
            throw new NotFoundException(
                `Submission with ID "${submissionId}" not found`
            );
        }

        await this.monthlySubmissionRepo.delete(submissionId);

        const key = this.performanceKey(submission);
        await this.syncPerformance(submission.deliverable.id, (perf) => {
            const year = submission.year.toString();
            if (key && perf[year]) {
                delete perf[year][key];
                if (Object.keys(perf[year]).length === 0) delete perf[year];
            }
        });
    }

    /** Key used for a submission inside the deliverable's yearlyPerformance JSON (q1..q4 or m1..m12). */
    private performanceKey(s: { quarter?: string; month?: number }): string | null {
        if (s.quarter) return s.quarter.toLowerCase();
        if (s.month) return `m${s.month}`;
        return null;
    }

    /** Applies an in-place change to a deliverable's yearlyPerformance JSON and saves it. */
    private async syncPerformance(
        deliverableId: string,
        change: (perf: Record<string, any>) => void
    ): Promise<void> {
        const deliverable = await this.deliverableRepo.findOne({ where: { id: deliverableId } });
        if (!deliverable) return;
        const perf = { ...(deliverable.yearlyPerformance || {}) };
        for (const year of Object.keys(perf)) perf[year] = { ...perf[year] };
        change(perf);
        deliverable.yearlyPerformance = perf;
        await this.deliverableRepo.save(deliverable);
    }
}
