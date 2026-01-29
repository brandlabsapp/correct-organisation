import {
	IsString,
	IsOptional,
	IsNumber,
	IsArray,
	IsDateString,
	IsUUID,
	ValidateNested,
	Min,
	IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEstimateLineItemDto {
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
	hsnCode?: string;

	@IsString()
	@IsOptional()
	taxName?: string;

	@IsNumber()
	@Min(0)
	@IsOptional()
	taxRate?: number;

	@IsNumber()
	@Min(0)
	@IsOptional()
	discountPercent?: number;

	@IsUUID()
	@IsOptional()
	savedItemId?: string;
}

export class CreateEstimateDto {
	@IsUUID()
	@IsOptional()
	clientId?: string;

	@IsUUID()
	@IsOptional()
	projectId?: string;

	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsDateString()
	estimateDate: string;

	@IsDateString()
	@IsOptional()
	expiryDate?: string;

	@IsString()
	@IsOptional()
	currency?: string;

	@IsString()
	@IsOptional()
	notes?: string;

	@IsString()
	@IsOptional()
	termsAndConditions?: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateEstimateLineItemDto)
	lineItems: CreateEstimateLineItemDto[];

	@IsBoolean()
	@IsOptional()
	saveAsDraft?: boolean;
}
