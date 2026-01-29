import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateInvoiceDto } from './create-invoice.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { InvoiceStatus } from '../entities/finance-invoice.entity';

export class UpdateInvoiceDto extends PartialType(
	OmitType(CreateInvoiceDto, ['invoiceType'] as const)
) {
	@IsEnum(InvoiceStatus)
	@IsOptional()
	status?: InvoiceStatus;
}
