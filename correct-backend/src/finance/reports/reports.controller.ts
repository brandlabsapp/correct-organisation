import { Controller, Get, Query, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CompanyService } from '@/company/company.service';

@Controller('finance/dashboard')
export class ReportsController {
	constructor(
		private readonly reportsService: ReportsService,
		private readonly companyService: CompanyService,
	) {}

	@Get('metrics')
	async getMetrics(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.reportsService.getDashboardMetrics(company.id);
	}

	@Get('revenue-chart')
	async getRevenueChart(
		@Req() req: any,
		@Query('months') months?: string
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.reportsService.getRevenueChartData(
			company.id,
			months ? parseInt(months, 10) : 12
		);
	}

	@Get('invoice-summary')
	async getInvoiceSummary(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.reportsService.getInvoiceSummary(company.id);
	}

	@Get('accounts-receivable')
	async getAccountsReceivable(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.reportsService.getAccountsReceivable(company.id);
	}

	@Get('accounts-payable')
	async getAccountsPayable(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.reportsService.getAccountsPayable(company.id);
	}

	@Get('activity')
	async getRecentActivity(
		@Req() req: any,
		@Query('limit') limit?: string
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.reportsService.getRecentActivity(
			company.id,
			limit ? parseInt(limit, 10) : 10
		);
	}
}
