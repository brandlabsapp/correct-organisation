import {
	IsString,
	IsOptional,
	IsEnum,
	IsNumber,
	IsDateString,
	Min,
} from 'class-validator';
import { PaymentMethod } from '@/finance/invoices/entities/finance-invoice-payment.entity';

export class RecordBillPaymentDto {
	@IsNumber()
	@Min(0.01)
	amount: number;

	@IsDateString()
	paymentDate: string;

	@IsEnum(PaymentMethod)
	@IsOptional()
	paymentMethod?: PaymentMethod;

	@IsString()
	@IsOptional()
	referenceNumber?: string;

	@IsString()
	@IsOptional()
	notes?: string;
}
