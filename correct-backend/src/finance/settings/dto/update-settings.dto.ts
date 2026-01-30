import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class UpdateSettingsDto {
	@IsString()
	@IsOptional()
	defaultCurrency?: string;

	@IsString()
	@IsOptional()
	defaultLanguage?: string;

	@IsNumber()
	@Min(0)
	@IsOptional()
	defaultPaymentTerms?: number;

	@IsBoolean()
	@IsOptional()
	enableGst?: boolean;

	@IsNumber()
	@Min(0)
	@IsOptional()
	defaultGstRate?: number;

	@IsString()
	@IsOptional()
	logoUrl?: string;

	@IsString()
	@IsOptional()
	primaryColor?: string;

	@IsString()
	@IsOptional()
	accentColor?: string;

	@IsString()
	@IsOptional()
	defaultInvoiceNotes?: string;

	@IsString()
	@IsOptional()
	defaultInvoiceFooter?: string;

	@IsString()
	@IsOptional()
	defaultEstimateTerms?: string;

	@IsString()
	@IsOptional()
	invoiceEmailSubject?: string;

	@IsString()
	@IsOptional()
	invoiceEmailBody?: string;

	@IsString()
	@IsOptional()
	bankName?: string;

	@IsString()
	@IsOptional()
	bankAccountName?: string;

	@IsString()
	@IsOptional()
	bankAccountNumber?: string;

	@IsString()
	@IsOptional()
	bankIfscCode?: string;

	@IsString()
	@IsOptional()
	bankSwiftCode?: string;
}
