import { PartialType } from '@nestjs/mapped-types';
import { CreateEstimateDto } from './create-estimate.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstimateStatus } from '../entities/finance-estimate.entity';

export class UpdateEstimateDto extends PartialType(CreateEstimateDto) {
	@IsEnum(EstimateStatus)
	@IsOptional()
	status?: EstimateStatus;
}
