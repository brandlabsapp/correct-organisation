import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Req,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { CreateTaxRateDto } from './dto/create-tax-rate.dto';
import { CreateSavedItemDto } from './dto/create-saved-item.dto';
import { CompanyService } from '@/company/company.service';

@Controller('finance/settings')
export class SettingsController {
	constructor(
		private readonly settingsService: SettingsService,
		private readonly companyService: CompanyService,
	) {}

	// ============ Settings ============

	@Get()
	async getSettings(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.getSettings(company.id);
	}

	@Put()
	async updateSettings(
		@Req() req: any,
		@Body() updateSettingsDto: UpdateSettingsDto
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.updateSettings(company.id, updateSettingsDto);
	}

	// ============ Tax Rates ============

	@Get('tax-rates')
	async getTaxRates(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.getTaxRates(company.id);
	}

	@Post('tax-rates')
	async createTaxRate(
		@Req() req: any,
		@Body() createTaxRateDto: CreateTaxRateDto
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.createTaxRate(company.id, createTaxRateDto);
	}

	@Put('tax-rates/:id')
	async updateTaxRate(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateDto: Partial<CreateTaxRateDto> & { isActive?: boolean }
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.updateTaxRate(id, company.id, updateDto);
	}

	@Delete('tax-rates/:id')
	async deleteTaxRate(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.deleteTaxRate(id, company.id);
	}

	// ============ Saved Items ============

	@Get('saved-items')
	async getSavedItems(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.getSavedItems(company.id);
	}

	@Post('saved-items')
	async createSavedItem(
		@Req() req: any,
		@Body() createSavedItemDto: CreateSavedItemDto
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.createSavedItem(company.id, createSavedItemDto);
	}

	@Put('saved-items/:id')
	async updateSavedItem(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateDto: Partial<CreateSavedItemDto> & { isActive?: boolean }
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.updateSavedItem(id, company.id, updateDto);
	}

	@Delete('saved-items/:id')
	async deleteSavedItem(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.settingsService.deleteSavedItem(id, company.id);
	}
}
