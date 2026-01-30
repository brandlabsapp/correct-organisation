import {
	IsString,
	IsOptional,
	IsEnum,
	IsNumber,
	IsDateString,
	IsUUID,
	Min,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	code?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsUUID()
	@IsOptional()
	clientId?: string;

	@IsEnum(ProjectStatus)
	@IsOptional()
	status?: ProjectStatus;

	@IsDateString()
	@IsOptional()
	startDate?: string;

	@IsDateString()
	@IsOptional()
	endDate?: string;

	@IsNumber()
	@Min(0)
	@IsOptional()
	budget?: number;

	@IsString()
	@IsOptional()
	currency?: string;
}
