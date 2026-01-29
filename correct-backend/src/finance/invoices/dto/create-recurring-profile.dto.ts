import {
	IsString,
	IsOptional,
	IsEnum,
	IsNumber,
	IsArray,
	IsDateString,
	IsUUID,
	IsBoolean,
	ValidateNested,
	Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecurringFrequency } from '../entities/finance-recurring-profile.entity';

export class RecurringLineItemDto {
	@IsString()
	description: string;

	@IsNumber()
	@Min(0)
	quantity: number;

	@IsString()
	@IsOptional()
	unit?: string;

	@IsNumber()
	@Min(0)
	rate: number;

	@IsString()
	@IsOptional()
	sacCode?: string;

	@IsString()
	@IsOptional()
	taxName?: string;

	@IsNumber()
	@Min(0)
	@IsOptional()
	taxRate?: number;
}

export class CreateRecurringProfileDto {
	@IsString()
	profileName: string;

	@IsUUID()
	@IsOptional()
	clientId?: string;

	@IsEnum(RecurringFrequency)
	frequency: RecurringFrequency;

	@IsDateString()
	startDate: string;

	@IsDateString()
	@IsOptional()
	endDate?: string;

	@IsNumber()
	@Min(1)
	@IsOptional()
	maxOccurrences?: number;

	@IsString()
	@IsOptional()
	invoiceType?: string;

	@IsString()
	@IsOptional()
	currency?: string;

	@IsString()
	@IsOptional()
	paymentTerms?: string;

	@IsString()
	@IsOptional()
	notes?: string;

	@IsBoolean()
	@IsOptional()
	autoSend?: boolean;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => RecurringLineItemDto)
	lineItems: RecurringLineItemDto[];
}
