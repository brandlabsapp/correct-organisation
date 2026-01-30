import { Controller, Get, Query, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('finance/dashboard')
export class ReportsController {
	constructor(private readonly reportsService: ReportsService) {}

	@Get('metrics')
	getMetrics(@Req() req: any) {
		const companyId = req.query.company;
		return this.reportsService.getDashboardMetrics(companyId);
	}

	@Get('revenue-chart')
	getRevenueChart(@Req() req: any, @Query('months') months?: string) {
		const companyId = req.query.company;
		return this.reportsService.getRevenueChartData(
			companyId,
			months ? parseInt(months, 10) : 12
		);
	}

	@Get('invoice-summary')
	getInvoiceSummary(@Req() req: any) {
		const companyId = req.query.company;
		return this.reportsService.getInvoiceSummary(companyId);
	}

	@Get('accounts-receivable')
	getAccountsReceivable(@Req() req: any) {
		const companyId = req.query.company;
		return this.reportsService.getAccountsReceivable(companyId);
	}

	@Get('accounts-payable')
	getAccountsPayable(@Req() req: any) {
		const companyId = req.query.company;
		return this.reportsService.getAccountsPayable(companyId);
	}

	@Get('activity')
	getRecentActivity(@Req() req: any, @Query('limit') limit?: string) {
		const companyId = req.query.company;
		return this.reportsService.getRecentActivity(
			companyId,
			limit ? parseInt(limit, 10) : 10
		);
	}
}
