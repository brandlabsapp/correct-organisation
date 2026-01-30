import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { FinanceSettings } from './entities/finance-settings.entity';
import { FinanceTaxRate } from './entities/finance-tax-rate.entity';
import { FinanceSavedItem } from './entities/finance-saved-item.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { CreateTaxRateDto } from './dto/create-tax-rate.dto';
import { CreateSavedItemDto } from './dto/create-saved-item.dto';

@Injectable()
export class SettingsService {
	constructor(
		@Inject('FINANCE_SETTINGS_REPOSITORY')
		private readonly settingsRepository: typeof FinanceSettings,
		@Inject('FINANCE_TAX_RATE_REPOSITORY')
		private readonly taxRateRepository: typeof FinanceTaxRate,
		@Inject('FINANCE_SAVED_ITEM_REPOSITORY')
		private readonly savedItemRepository: typeof FinanceSavedItem
	) {}

	// ============ Settings ============

	async getSettings(companyId: number): Promise<FinanceSettings> {
		let settings = await this.settingsRepository.findOne({
			where: { companyId },
		});

		if (!settings) {
			// Create default settings
			settings = await this.settingsRepository.create({
				companyId,
				defaultCurrency: 'INR',
				defaultLanguage: 'en-IN',
				defaultPaymentTerms: 30,
				enableGst: true,
				defaultGstRate: 18,
			});
		}

		return settings;
	}

	async updateSettings(
		companyId: number,
		updateSettingsDto: UpdateSettingsDto
	): Promise<FinanceSettings> {
		const settings = await this.getSettings(companyId);
		await settings.update(updateSettingsDto);
		return settings;
	}

	// ============ Tax Rates ============

	async getTaxRates(companyId: number): Promise<FinanceTaxRate[]> {
		return this.taxRateRepository.findAll({
			where: { companyId, isActive: true },
			order: [['rate', 'ASC']],
		});
	}

	async createTaxRate(
		companyId: number,
		createTaxRateDto: CreateTaxRateDto
	): Promise<FinanceTaxRate> {
		// If this is default, unset other defaults
		if (createTaxRateDto.isDefault) {
			await this.taxRateRepository.update(
				{ isDefault: false },
				{ where: { companyId } }
			);
		}

		return this.taxRateRepository.create({
			...createTaxRateDto,
			companyId,
		});
	}

	async updateTaxRate(
		id: string,
		companyId: number,
		updateDto: Partial<CreateTaxRateDto> & { isActive?: boolean }
	): Promise<FinanceTaxRate> {
		const taxRate = await this.taxRateRepository.findOne({
			where: { id, companyId },
		});

		if (!taxRate) {
			throw new NotFoundException(`Tax rate with ID ${id} not found`);
		}

		// If setting as default, unset other defaults
		if (updateDto.isDefault) {
			await this.taxRateRepository.update(
				{ isDefault: false },
				{ where: { companyId } }
			);
		}

		await taxRate.update(updateDto);
		return taxRate;
	}

	async deleteTaxRate(id: string, companyId: number): Promise<void> {
		const taxRate = await this.taxRateRepository.findOne({
			where: { id, companyId },
		});

		if (!taxRate) {
			throw new NotFoundException(`Tax rate with ID ${id} not found`);
		}

		await taxRate.destroy();
	}

	// ============ Saved Items ============

	async getSavedItems(companyId: number): Promise<FinanceSavedItem[]> {
		return this.savedItemRepository.findAll({
			where: { companyId, isActive: true },
			order: [['name', 'ASC']],
		});
	}

	async createSavedItem(
		companyId: number,
		createSavedItemDto: CreateSavedItemDto
	): Promise<FinanceSavedItem> {
		return this.savedItemRepository.create({
			...createSavedItemDto,
			companyId,
		});
	}

	async updateSavedItem(
		id: string,
		companyId: number,
		updateDto: Partial<CreateSavedItemDto> & { isActive?: boolean }
	): Promise<FinanceSavedItem> {
		const savedItem = await this.savedItemRepository.findOne({
			where: { id, companyId },
		});

		if (!savedItem) {
			throw new NotFoundException(`Saved item with ID ${id} not found`);
		}

		await savedItem.update(updateDto);
		return savedItem;
	}

	async deleteSavedItem(id: string, companyId: number): Promise<void> {
		const savedItem = await this.savedItemRepository.findOne({
			where: { id, companyId },
		});

		if (!savedItem) {
			throw new NotFoundException(`Saved item with ID ${id} not found`);
		}

		await savedItem.destroy();
	}
}
