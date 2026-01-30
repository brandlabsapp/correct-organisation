import {
	IsString,
	IsOptional,
	IsNumber,
	IsEnum,
	IsUUID,
	Min,
} from 'class-validator';
import { SavedItemType } from '../entities/finance-saved-item.entity';

export class CreateSavedItemDto {
	@IsEnum(SavedItemType)
	@IsOptional()
	itemType?: SavedItemType;

	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsNumber()
	@Min(0)
	rate: number;

	@IsString()
	@IsOptional()
	unit?: string;

	@IsString()
	@IsOptional()
	sacCode?: string;

	@IsString()
	@IsOptional()
	hsnCode?: string;

	@IsUUID()
	@IsOptional()
	defaultTaxRateId?: string;
}
