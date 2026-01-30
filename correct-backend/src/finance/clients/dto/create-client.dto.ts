import {
	IsString,
	IsOptional,
	IsEmail,
	IsEnum,
	IsBoolean,
	IsNumber,
	Min,
} from 'class-validator';
import { ClientType } from '../entities/finance-client.entity';

export class CreateClientDto {
	@IsEnum(ClientType)
	@IsOptional()
	clientType?: ClientType;

	@IsString()
	name: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	phone?: string;

	@IsString()
	@IsOptional()
	contactPerson?: string;

	@IsString()
	@IsOptional()
	billingAddress?: string;

	@IsString()
	@IsOptional()
	city?: string;

	@IsString()
	@IsOptional()
	state?: string;

	@IsString()
	@IsOptional()
	country?: string;

	@IsString()
	@IsOptional()
	postalCode?: string;

	@IsString()
	@IsOptional()
	gstNumber?: string;

	@IsString()
	@IsOptional()
	panNumber?: string;

	@IsString()
	@IsOptional()
	taxId?: string;

	@IsString()
	@IsOptional()
	defaultCurrency?: string;

	@IsNumber()
	@Min(0)
	@IsOptional()
	defaultPaymentTerms?: number;

	@IsString()
	@IsOptional()
	notes?: string;
}
