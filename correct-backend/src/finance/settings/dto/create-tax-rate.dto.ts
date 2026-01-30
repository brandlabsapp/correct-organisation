import {
	IsString,
	IsOptional,
	IsNumber,
	IsBoolean,
	Min,
	Max,
} from 'class-validator';

export class CreateTaxRateDto {
	@IsString()
	name: string;

	@IsNumber()
	@Min(0)
	@Max(100)
	rate: number;

	@IsString()
	@IsOptional()
	description?: string;

	@IsBoolean()
	@IsOptional()
	isDefault?: boolean;
}
