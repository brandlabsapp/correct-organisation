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

@Controller('finance/settings')
export class SettingsController {
	constructor(private readonly settingsService: SettingsService) {}

	// ============ Settings ============

	@Get()
	getSettings(@Req() req: any) {
		const companyId = req.query.company;
		return this.settingsService.getSettings(companyId);
	}

	@Put()
	updateSettings(@Req() req: any, @Body() updateSettingsDto: UpdateSettingsDto) {
		const companyId = req.query.company;
		return this.settingsService.updateSettings(companyId, updateSettingsDto);
	}

	// ============ Tax Rates ============

	@Get('tax-rates')
	getTaxRates(@Req() req: any) {
		const companyId = req.query.company;
		return this.settingsService.getTaxRates(companyId);
	}

	@Post('tax-rates')
	createTaxRate(@Req() req: any, @Body() createTaxRateDto: CreateTaxRateDto) {
		const companyId = req.query.company;
		return this.settingsService.createTaxRate(companyId, createTaxRateDto);
	}

	@Put('tax-rates/:id')
	updateTaxRate(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateDto: Partial<CreateTaxRateDto> & { isActive?: boolean }
	) {
		const companyId = req.query.company;
		return this.settingsService.updateTaxRate(id, companyId, updateDto);
	}

	@Delete('tax-rates/:id')
	deleteTaxRate(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.settingsService.deleteTaxRate(id, companyId);
	}

	// ============ Saved Items ============

	@Get('saved-items')
	getSavedItems(@Req() req: any) {
		const companyId = req.query.company;
		return this.settingsService.getSavedItems(companyId);
	}

	@Post('saved-items')
	createSavedItem(
		@Req() req: any,
		@Body() createSavedItemDto: CreateSavedItemDto
	) {
		const companyId = req.query.company;
		return this.settingsService.createSavedItem(companyId, createSavedItemDto);
	}

	@Put('saved-items/:id')
	updateSavedItem(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateDto: Partial<CreateSavedItemDto> & { isActive?: boolean }
	) {
		const companyId = req.query.company;
		return this.settingsService.updateSavedItem(id, companyId, updateDto);
	}

	@Delete('saved-items/:id')
	deleteSavedItem(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.settingsService.deleteSavedItem(id, companyId);
	}
}
