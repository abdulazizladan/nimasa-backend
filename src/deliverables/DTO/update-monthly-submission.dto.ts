import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateMonthlySubmissionDto } from './create-monthly-submission.dto';

export class UpdateMonthlySubmissionDto extends PartialType(
    OmitType(CreateMonthlySubmissionDto, ['deliverableId'] as const)
) { }
