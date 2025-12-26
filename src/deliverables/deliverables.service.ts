import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deliverable } from './entities/deliverable.entity';
import { MonthlySubmission } from './entities/monthly-submission.entity';
import { CreateDeliverableDto } from './DTO/create-deliverable.dto';
import { UpdateDeliverableDto } from './DTO/update-deliverable.dto';
import { QueryDeliverablesDto } from './DTO/query-deliverables.dto';
import { CreateMonthlySubmissionDto } from './DTO/create-monthly-submission.dto';
import { UpdateMonthlySubmissionDto } from './DTO/update-monthly-submission.dto';

@Injectable()
export class DeliverablesService {
    constructor(
        @InjectRepository(Deliverable)
        private readonly deliverableRepo: Repository<Deliverable>,
        @InjectRepository(MonthlySubmission)
        private readonly monthlySubmissionRepo: Repository<MonthlySubmission>,
    ) { }

    async create(dto: CreateDeliverableDto): Promise<Deliverable> {
        const deliverable = this.deliverableRepo.create(dto);
        return this.deliverableRepo.save(deliverable);
    }

    async findAll(query: QueryDeliverablesDto): Promise<Deliverable[]> {
        const qb = this.deliverableRepo.createQueryBuilder('d');

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

    async findOne(id: string): Promise<Deliverable> {
        const deliverable = await this.deliverableRepo.findOne({
            where: { id },
            relations: ['monthlySubmissions']
        });
        if (!deliverable) {
            throw new NotFoundException(`Deliverable with ID "${id}" not found`);
        }
        return deliverable;
    }

    async update(id: string, dto: UpdateDeliverableDto): Promise<Deliverable> {
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
    ): Promise<MonthlySubmission> {
        const deliverable = await this.deliverableRepo.findOne({ where: { id: deliverableId } });

        if (!deliverable) {
            throw new NotFoundException(`Deliverable with ID "${deliverableId}" not found`);
        }

        // Check if submission already exists for this month/year
        const existingSubmission = await this.monthlySubmissionRepo.findOne({
            where: {
                deliverable: { id: deliverableId },
                year: dto.year,
                month: dto.month,
            },
        });

        if (existingSubmission) {
            throw new BadRequestException(
                `Submission for ${dto.month}/${dto.year} already exists. Use update instead.`
            );
        }

        const submission = this.monthlySubmissionRepo.create({
            deliverable,
            year: dto.year,
            month: dto.month,
            actualValue: dto.actualValue,
            progress: dto.progress,
            keyIssues: dto.keyIssues,
            mdaEfforts: dto.mdaEfforts,
            comments: dto.comments,
        });

        return this.monthlySubmissionRepo.save(submission);
    }

    async getSubmissions(deliverableId: string): Promise<MonthlySubmission[]> {
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
    ): Promise<MonthlySubmission> {
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
    ): Promise<MonthlySubmission> {
        const submission = await this.monthlySubmissionRepo.findOne({
            where: { id: submissionId },
            relations: ['deliverable'],
        });

        if (!submission) {
            throw new NotFoundException(
                `Submission with ID "${submissionId}" not found`
            );
        }

        Object.assign(submission, dto);
        return this.monthlySubmissionRepo.save(submission);
    }

    async removeSubmission(submissionId: string): Promise<void> {
        const result = await this.monthlySubmissionRepo.delete(submissionId);
        if (result.affected === 0) {
            throw new NotFoundException(
                `Submission with ID "${submissionId}" not found`
            );
        }
    }
}
