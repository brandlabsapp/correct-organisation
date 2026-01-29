import {
	Injectable,
	Inject,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { FinanceBill, BillStatus } from './entities/finance-bill.entity';
import { FinanceBillLineItem } from './entities/finance-bill-line-item.entity';
import { FinanceBillPayment } from './entities/finance-bill-payment.entity';
import { FinanceClient } from '../clients/entities/finance-client.entity';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { RecordBillPaymentDto } from './dto/record-bill-payment.dto';
import { SequenceService } from '../settings/sequence.service';
import {
	calculateLineItemAmount,
	calculateInvoiceTotals,
} from '../shared/finance.utils';
import { PaymentMethod } from '../invoices/entities/finance-invoice-payment.entity';
import { Op } from 'sequelize';

@Injectable()
export class BillsService {
	constructor(
		@Inject('FINANCE_BILL_REPOSITORY')
		private readonly billRepository: typeof FinanceBill,
		@Inject('FINANCE_BILL_LINE_ITEM_REPOSITORY')
		private readonly lineItemRepository: typeof FinanceBillLineItem,
		@Inject('FINANCE_BILL_PAYMENT_REPOSITORY')
		private readonly paymentRepository: typeof FinanceBillPayment,
		private readonly sequenceService: SequenceService
	) {}

	async create(
		companyId: number,
		createBillDto: CreateBillDto
	): Promise<FinanceBill> {
		const { lineItems, saveAsDraft, ...billData } = createBillDto;

		// Generate bill number
		const { number: billNumber, financialYear } =
			await this.sequenceService.generateNextNumber(companyId, 'bil');

		// Calculate line item amounts
		const calculatedLineItems = lineItems.map((item, index) => {
			const amounts = calculateLineItemAmount(
				item.quantity,
				item.rate,
				0, // No discount for bills typically
				item.taxRate || 0
			);
			return {
				...item,
				sortOrder: index,
				...amounts,
			};
		});

		// Calculate bill totals
		const totals = calculateInvoiceTotals(calculatedLineItems, 0);

		// Create bill
		const bill = await this.billRepository.create({
			...billData,
			companyId,
			billNumber,
			financialYear,
			billDate: new Date(billData.billDate),
			dueDate: billData.dueDate ? new Date(billData.dueDate) : null,
			status: saveAsDraft ? BillStatus.DRAFT : BillStatus.UNPAID,
			...totals,
			balanceDue: totals.totalAmount,
		});

		// Create line items
		await Promise.all(
			calculatedLineItems.map((item) =>
				this.lineItemRepository.create({
					...item,
					billId: bill.id,
				})
			)
		);

		return this.findOne(bill.id, companyId);
	}

	async findAll(
		companyId: number,
		options?: {
			status?: BillStatus;
			vendorId?: string;
			projectId?: string;
			financialYear?: string;
			fromDate?: string;
			toDate?: string;
			search?: string;
			limit?: number;
			offset?: number;
		}
	): Promise<{ rows: FinanceBill[]; count: number }> {
		const where: any = { companyId };

		if (options?.status) {
			where.status = options.status;
		}

		if (options?.vendorId) {
			where.vendorId = options.vendorId;
		}

		if (options?.projectId) {
			where.projectId = options.projectId;
		}

		if (options?.financialYear) {
			where.financialYear = options.financialYear;
		}

		if (options?.fromDate || options?.toDate) {
			where.billDate = {};
			if (options?.fromDate) {
				where.billDate[Op.gte] = new Date(options.fromDate);
			}
			if (options?.toDate) {
				where.billDate[Op.lte] = new Date(options.toDate);
			}
		}

		if (options?.search) {
			where[Op.or] = [
				{ billNumber: { [Op.iLike]: `%${options.search}%` } },
				{ vendorInvoiceNumber: { [Op.iLike]: `%${options.search}%` } },
			];
		}

		return this.billRepository.findAndCountAll({
			where,
			include: [
				{
					model: FinanceClient,
					as: 'vendor',
					attributes: ['id', 'name', 'email'],
				},
			],
			limit: options?.limit || 50,
			offset: options?.offset || 0,
			order: [['billDate', 'DESC']],
		});
	}

	async findOne(id: string, companyId: number): Promise<FinanceBill> {
		const bill = await this.billRepository.findOne({
			where: { id, companyId },
			include: [
				{
					model: FinanceClient,
					as: 'vendor',
				},
				{
					model: FinanceBillLineItem,
					as: 'lineItems',
				},
				{
					model: FinanceBillPayment,
					as: 'payments',
					order: [['paymentDate', 'DESC']],
				},
			],
		});

		if (!bill) {
			throw new NotFoundException(`Bill with ID ${id} not found`);
		}

		return bill;
	}

	async update(
		id: string,
		companyId: number,
		updateBillDto: UpdateBillDto
	): Promise<FinanceBill> {
		const bill = await this.findOne(id, companyId);

		if (bill.status === BillStatus.PAID) {
			throw new BadRequestException('Cannot update a paid bill');
		}

		const { lineItems, ...billData } = updateBillDto;

		// Prepare update data
		const updateData: any = { ...billData };
		if (billData.billDate) {
			updateData.billDate = new Date(billData.billDate);
		}
		if (billData.dueDate) {
			updateData.dueDate = new Date(billData.dueDate);
		}

		await bill.update(updateData);

		if (lineItems) {
			await this.lineItemRepository.destroy({
				where: { billId: id },
			});

			const calculatedLineItems = lineItems.map((item, index) => {
				const amounts = calculateLineItemAmount(
					item.quantity,
					item.rate,
					0,
					item.taxRate || 0
				);
				return {
					...item,
					sortOrder: index,
					...amounts,
				};
			});

			const totals = calculateInvoiceTotals(calculatedLineItems, 0);

			await Promise.all(
				calculatedLineItems.map((item) =>
					this.lineItemRepository.create({
						...item,
						billId: id,
					})
				)
			);

			await bill.update({
				...totals,
				balanceDue: totals.totalAmount - bill.paidAmount,
			});
		}

		return this.findOne(id, companyId);
	}

	async remove(id: string, companyId: number): Promise<void> {
		const bill = await this.findOne(id, companyId);

		if (bill.status === BillStatus.PAID) {
			throw new BadRequestException('Cannot delete a paid bill');
		}

		await bill.destroy();
	}

	async markAsPaid(id: string, companyId: number): Promise<FinanceBill> {
		const bill = await this.findOne(id, companyId);

		const balanceDue = bill.balanceDue || bill.totalAmount;

		await this.paymentRepository.create({
			billId: id,
			amount: balanceDue,
			paymentDate: new Date(),
			paymentMethod: PaymentMethod.BANK_TRANSFER,
		});

		await bill.update({
			status: BillStatus.PAID,
			paidAmount: bill.totalAmount,
			balanceDue: 0,
		});

		return this.findOne(id, companyId);
	}

	async recordPayment(
		id: string,
		companyId: number,
		paymentDto: RecordBillPaymentDto
	): Promise<FinanceBill> {
		const bill = await this.findOne(id, companyId);

		if (bill.status === BillStatus.PAID) {
			throw new BadRequestException('Bill is already fully paid');
		}

		if (paymentDto.amount > bill.balanceDue) {
			throw new BadRequestException(
				`Payment amount exceeds balance due (${bill.balanceDue})`
			);
		}

		await this.paymentRepository.create({
			billId: id,
			...paymentDto,
			paymentDate: new Date(paymentDto.paymentDate),
		});

		const newPaidAmount = Number(bill.paidAmount) + Number(paymentDto.amount);
		const newBalanceDue = Number(bill.totalAmount) - newPaidAmount;
		const isFullyPaid = newBalanceDue <= 0;

		await bill.update({
			status: isFullyPaid ? BillStatus.PAID : BillStatus.PARTIALLY_PAID,
			paidAmount: newPaidAmount,
			balanceDue: newBalanceDue,
		});

		return this.findOne(id, companyId);
	}

	async updateOverdueBills(companyId?: number): Promise<number> {
		const where: any = {
			status: {
				[Op.in]: [BillStatus.UNPAID, BillStatus.PARTIALLY_PAID],
			},
			dueDate: {
				[Op.lt]: new Date(),
			},
		};

		if (companyId) {
			where.companyId = companyId;
		}

		const [count] = await this.billRepository.update(
			{ status: BillStatus.OVERDUE },
			{ where }
		);

		return count;
	}
}
