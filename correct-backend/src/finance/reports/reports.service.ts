import { Injectable, Inject } from '@nestjs/common';
import { FinanceInvoice, InvoiceStatus } from '../invoices/entities/finance-invoice.entity';
import { FinanceBill, BillStatus } from '../bills/entities/finance-bill.entity';
import { FinanceClient } from '../clients/entities/finance-client.entity';
import { Op, fn, col } from 'sequelize';
import {
	getCurrentFinancialYear,
	getFinancialYearRange,
} from '../shared/finance.utils';

export interface DashboardMetrics {
	totalOutstanding: number;
	totalOverdue: number;
	totalCollectedThisYear: number;
	totalClients: number;
	totalInvoices: number;
	totalBills: number;
}

export interface RevenueChartData {
	month: string;
	invoiced: number;
	received: number;
}

export interface InvoiceSummary {
	invoiced: number;
	received: number;
	outstanding: number;
}

export interface AccountsReceivable {
	clientId: string;
	clientName: string;
	totalOutstanding: number;
	invoices: {
		id: string;
		invoiceNumber: string;
		amount: number;
		dueDate: Date;
	}[];
}

@Injectable()
export class ReportsService {
	constructor(
		@Inject('FINANCE_INVOICE_REPOSITORY')
		private readonly invoiceRepository: typeof FinanceInvoice,
		@Inject('FINANCE_BILL_REPOSITORY')
		private readonly billRepository: typeof FinanceBill,
		@Inject('FINANCE_CLIENT_REPOSITORY')
		private readonly clientRepository: typeof FinanceClient
	) {}

	async getDashboardMetrics(companyId: number): Promise<DashboardMetrics> {
		const fyRange = getFinancialYearRange();

		// Total Outstanding (unpaid invoices)
		const outstandingResult = await this.invoiceRepository.findOne({
			where: {
				companyId,
				status: {
					[Op.in]: [
						InvoiceStatus.SENT,
						InvoiceStatus.PARTIALLY_PAID,
						InvoiceStatus.OVERDUE,
					],
				},
			},
			attributes: [[fn('SUM', col('balanceDue')), 'total']],
			raw: true,
		});
		const totalOutstanding = Number((outstandingResult as any)?.total) || 0;

		// Total Overdue
		const overdueResult = await this.invoiceRepository.findOne({
			where: {
				companyId,
				status: InvoiceStatus.OVERDUE,
			},
			attributes: [[fn('SUM', col('balanceDue')), 'total']],
			raw: true,
		});
		const totalOverdue = Number((overdueResult as any)?.total) || 0;

		// Total Collected This Year
		const collectedResult = await this.invoiceRepository.findOne({
			where: {
				companyId,
				paidAt: {
					[Op.gte]: fyRange.start,
					[Op.lte]: fyRange.end,
				},
			},
			attributes: [[fn('SUM', col('paidAmount')), 'total']],
			raw: true,
		});
		const totalCollectedThisYear = Number((collectedResult as any)?.total) || 0;

		// Total Clients
		const totalClients = await this.clientRepository.count({
			where: { companyId, isActive: true },
		});

		// Total Invoices
		const totalInvoices = await this.invoiceRepository.count({
			where: { companyId },
		});

		// Total Bills
		const totalBills = await this.billRepository.count({
			where: { companyId },
		});

		return {
			totalOutstanding,
			totalOverdue,
			totalCollectedThisYear,
			totalClients,
			totalInvoices,
			totalBills,
		};
	}

	async getRevenueChartData(
		companyId: number,
		months: number = 12
	): Promise<RevenueChartData[]> {
		const startDate = new Date();
		startDate.setMonth(startDate.getMonth() - months + 1);
		startDate.setDate(1);

		// Get invoiced amounts by month
		const invoicedData = await this.invoiceRepository.findAll({
			where: {
				companyId,
				invoiceDate: { [Op.gte]: startDate },
			},
			attributes: [
				[fn('DATE_TRUNC', 'month', col('invoiceDate')), 'month'],
				[fn('SUM', col('totalAmount')), 'invoiced'],
			],
			group: [fn('DATE_TRUNC', 'month', col('invoiceDate'))],
			raw: true,
		});

		// Get received amounts by month
		const receivedData = await this.invoiceRepository.findAll({
			where: {
				companyId,
				paidAt: { [Op.gte]: startDate },
			},
			attributes: [
				[fn('DATE_TRUNC', 'month', col('paidAt')), 'month'],
				[fn('SUM', col('paidAmount')), 'received'],
			],
			group: [fn('DATE_TRUNC', 'month', col('paidAt'))],
			raw: true,
		});

		// Combine data
		const monthsMap = new Map<string, RevenueChartData>();

		for (let i = 0; i < months; i++) {
			const date = new Date();
			date.setMonth(date.getMonth() - i);
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			monthsMap.set(monthKey, {
				month: monthKey,
				invoiced: 0,
				received: 0,
			});
		}

		invoicedData.forEach((row: any) => {
			const date = new Date(row.month);
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			const existing = monthsMap.get(monthKey);
			if (existing) {
				existing.invoiced = Number(row.invoiced) || 0;
			}
		});

		receivedData.forEach((row: any) => {
			const date = new Date(row.month);
			const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			const existing = monthsMap.get(monthKey);
			if (existing) {
				existing.received = Number(row.received) || 0;
			}
		});

		return Array.from(monthsMap.values()).reverse();
	}

	async getInvoiceSummary(companyId: number): Promise<InvoiceSummary> {
		const fyRange = getFinancialYearRange();

		// Total Invoiced this FY
		const invoicedResult = await this.invoiceRepository.findOne({
			where: {
				companyId,
				invoiceDate: {
					[Op.gte]: fyRange.start,
					[Op.lte]: fyRange.end,
				},
			},
			attributes: [[fn('SUM', col('totalAmount')), 'total']],
			raw: true,
		});
		const invoiced = Number((invoicedResult as any)?.total) || 0;

		// Total Received this FY
		const receivedResult = await this.invoiceRepository.findOne({
			where: {
				companyId,
				paidAt: {
					[Op.gte]: fyRange.start,
					[Op.lte]: fyRange.end,
				},
			},
			attributes: [[fn('SUM', col('paidAmount')), 'total']],
			raw: true,
		});
		const received = Number((receivedResult as any)?.total) || 0;

		const outstanding = invoiced - received;

		return { invoiced, received, outstanding };
	}

	async getAccountsReceivable(companyId: number): Promise<AccountsReceivable[]> {
		const invoices = await this.invoiceRepository.findAll({
			where: {
				companyId,
				status: {
					[Op.in]: [
						InvoiceStatus.SENT,
						InvoiceStatus.PARTIALLY_PAID,
						InvoiceStatus.OVERDUE,
					],
				},
				balanceDue: { [Op.gt]: 0 },
			},
			include: [
				{
					model: FinanceClient,
					as: 'client',
					attributes: ['id', 'name'],
				},
			],
			order: [['dueDate', 'ASC']],
		});

		// Group by client
		const clientMap = new Map<string, AccountsReceivable>();

		invoices.forEach((invoice) => {
			const clientId = invoice.clientId || 'unknown';
			const clientName = invoice.client?.name || 'Unknown Client';

			if (!clientMap.has(clientId)) {
				clientMap.set(clientId, {
					clientId,
					clientName,
					totalOutstanding: 0,
					invoices: [],
				});
			}

			const entry = clientMap.get(clientId)!;
			entry.totalOutstanding += Number(invoice.balanceDue);
			entry.invoices.push({
				id: invoice.id,
				invoiceNumber: invoice.invoiceNumber,
				amount: Number(invoice.balanceDue),
				dueDate: invoice.dueDate,
			});
		});

		return Array.from(clientMap.values()).sort(
			(a, b) => b.totalOutstanding - a.totalOutstanding
		);
	}

	async getAccountsPayable(companyId: number) {
		const bills = await this.billRepository.findAll({
			where: {
				companyId,
				status: {
					[Op.in]: [BillStatus.UNPAID, BillStatus.PARTIALLY_PAID, BillStatus.OVERDUE],
				},
				balanceDue: { [Op.gt]: 0 },
			},
			include: [
				{
					model: FinanceClient,
					as: 'vendor',
					attributes: ['id', 'name'],
				},
			],
			order: [['dueDate', 'ASC']],
		});

		// Total payable
		const totalPayable = bills.reduce(
			(sum, bill) => sum + Number(bill.balanceDue),
			0
		);

		return {
			totalPayable,
			bills: bills.map((bill) => ({
				id: bill.id,
				billNumber: bill.billNumber,
				vendorName: bill.vendor?.name || 'Unknown Vendor',
				amount: Number(bill.balanceDue),
				dueDate: bill.dueDate,
			})),
		};
	}

	async getRecentActivity(companyId: number, limit: number = 10) {
		// Get recent invoices
		const recentInvoices = await this.invoiceRepository.findAll({
			where: { companyId },
			order: [['updatedAt', 'DESC']],
			limit,
			attributes: ['id', 'invoiceNumber', 'status', 'totalAmount', 'updatedAt'],
		});

		// Get recent bills
		const recentBills = await this.billRepository.findAll({
			where: { companyId },
			order: [['updatedAt', 'DESC']],
			limit,
			attributes: ['id', 'billNumber', 'status', 'totalAmount', 'updatedAt'],
		});

		// Combine and sort
		const activities = [
			...recentInvoices.map((inv) => ({
				type: 'invoice',
				id: inv.id,
				number: inv.invoiceNumber,
				status: inv.status,
				amount: inv.totalAmount,
				timestamp: inv.updatedAt,
				description: `Invoice ${inv.invoiceNumber} ${inv.status}`,
			})),
			...recentBills.map((bill) => ({
				type: 'bill',
				id: bill.id,
				number: bill.billNumber,
				status: bill.status,
				amount: bill.totalAmount,
				timestamp: bill.updatedAt,
				description: `Bill ${bill.billNumber} ${bill.status}`,
			})),
		];

		return activities
			.sort(
				(a, b) =>
					new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
			)
			.slice(0, limit);
	}
}
