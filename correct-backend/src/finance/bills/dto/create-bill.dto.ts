import {
	IsString,
	IsOptional,
	IsEnum,
	IsNumber,
	IsArray,
	IsDateString,
	IsUUID,
	ValidateNested,
	Min,
	IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBillLineItemDto {
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
}

export class CreateBillDto {
	@IsUUID()
	@IsOptional()
	vendorId?: string;

	@IsUUID()
	@IsOptional()
	projectId?: string;

	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	vendorInvoiceNumber?: string;

	@IsDateString()
	billDate: string;

	@IsDateString()
	@IsOptional()
	dueDate?: string;

	@IsString()
	@IsOptional()
	currency?: string;

	@IsString()
	@IsOptional()
	notes?: string;

	@IsString()
	@IsOptional()
	attachmentUrl?: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateBillLineItemDto)
	lineItems: CreateBillLineItemDto[];

	@IsBoolean()
	@IsOptional()
	saveAsDraft?: boolean;
}
