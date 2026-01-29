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
import {
	InvoiceType,
	PaymentTerms,
} from '../entities/finance-invoice.entity';

export class CreateInvoiceLineItemDto {
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

export class CreateInvoiceDto {
	@IsUUID()
	@IsOptional()
	clientId?: string;

	@IsUUID()
	@IsOptional()
	projectId?: string;

	@IsEnum(InvoiceType)
	@IsOptional()
	invoiceType?: InvoiceType;

	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	purchaseOrderNumber?: string;

	@IsDateString()
	invoiceDate: string;

	@IsDateString()
	@IsOptional()
	dueDate?: string;

	@IsEnum(PaymentTerms)
	@IsOptional()
	paymentTerms?: PaymentTerms;

	@IsString()
	@IsOptional()
	currency?: string;

	@IsString()
	@IsOptional()
	language?: string;

	@IsNumber()
	@Min(0)
	@IsOptional()
	shippingTotal?: number;

	@IsString()
	@IsOptional()
	notes?: string;

	@IsString()
	@IsOptional()
	footerNotes?: string;

	@IsString()
	@IsOptional()
	internalNotes?: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateInvoiceLineItemDto)
	lineItems: CreateInvoiceLineItemDto[];

	@IsBoolean()
	@IsOptional()
	saveAsDraft?: boolean;
}
