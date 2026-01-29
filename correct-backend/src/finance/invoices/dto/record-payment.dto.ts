import {
	IsString,
	IsOptional,
	IsEnum,
	IsNumber,
	IsDateString,
	Min,
} from 'class-validator';
import { PaymentMethod } from '../entities/finance-invoice-payment.entity';

export class RecordPaymentDto {
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
