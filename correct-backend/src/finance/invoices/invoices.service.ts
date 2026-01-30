import {
	Injectable,
	Inject,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import {
	FinanceInvoice,
	InvoiceStatus,
	InvoiceType,
} from './entities/finance-invoice.entity';
import { FinanceInvoiceLineItem } from './entities/finance-invoice-line-item.entity';
import { FinanceInvoicePayment, PaymentMethod } from './entities/finance-invoice-payment.entity';
import {
	FinanceInvoiceActivity,
	InvoiceActivityType,
} from './entities/finance-invoice-activity.entity';
import { FinanceClient } from '../clients/entities/finance-client.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { SequenceService } from '../settings/sequence.service';
import {
	calculateLineItemAmount,
	calculateInvoiceTotals,
	calculateDueDate,
} from '../shared/finance.utils';
import { Op } from 'sequelize';

@Injectable()
export class InvoicesService {
	constructor(
		@Inject('FINANCE_INVOICE_REPOSITORY')
		private readonly invoiceRepository: typeof FinanceInvoice,
		@Inject('FINANCE_INVOICE_LINE_ITEM_REPOSITORY')
		private readonly lineItemRepository: typeof FinanceInvoiceLineItem,
		@Inject('FINANCE_INVOICE_PAYMENT_REPOSITORY')
		private readonly paymentRepository: typeof FinanceInvoicePayment,
		@Inject('FINANCE_INVOICE_ACTIVITY_REPOSITORY')
		private readonly activityRepository: typeof FinanceInvoiceActivity,
		private readonly sequenceService: SequenceService
	) {}

	async create(
		companyId: number,
		userId: number,
		createInvoiceDto: CreateInvoiceDto
	): Promise<FinanceInvoice> {
		const { lineItems, saveAsDraft, ...invoiceData } = createInvoiceDto;

		// Determine invoice type (domestic = INV, export = EXP)
		const invoiceType = invoiceData.invoiceType || InvoiceType.DOMESTIC;
		const documentType = invoiceType === InvoiceType.EXPORT ? 'exp' : 'inv';

		// Generate invoice number
		const { number: invoiceNumber, financialYear } =
			await this.sequenceService.generateNextNumber(companyId, documentType);

		// Calculate due date if not provided
		let dueDate = invoiceData.dueDate
			? new Date(invoiceData.dueDate)
			: calculateDueDate(
					new Date(invoiceData.invoiceDate),
					invoiceData.paymentTerms || 'net_30'
			  );

		// Calculate line item amounts
		const calculatedLineItems = lineItems.map((item, index) => {
			const amounts = calculateLineItemAmount(
				item.quantity,
				item.rate,
				item.discountPercent || 0,
				item.taxRate || 0
			);
			return {
				...item,
				sortOrder: index,
				...amounts,
			};
		});

		// Calculate invoice totals
		const totals = calculateInvoiceTotals(
			calculatedLineItems,
			invoiceData.shippingTotal || 0
		);

		// Create invoice
		const invoice = await this.invoiceRepository.create({
			...invoiceData,
			companyId,
			invoiceNumber,
			invoiceType,
			financialYear,
			invoiceDate: new Date(invoiceData.invoiceDate),
			dueDate,
			status: saveAsDraft ? InvoiceStatus.DRAFT : InvoiceStatus.DRAFT,
			...totals,
			balanceDue: totals.totalAmount,
		});

		// Create line items
		await Promise.all(
			calculatedLineItems.map((item) =>
				this.lineItemRepository.create({
					...item,
					invoiceId: invoice.id,
				})
			)
		);

		// Log activity
		await this.logActivity(
			invoice.id,
			userId,
			InvoiceActivityType.CREATED,
			`Invoice ${invoiceNumber} created`
		);

		return this.findOne(invoice.id, companyId);
	}

	async findAll(
		companyId: number,
		options?: {
			status?: InvoiceStatus;
			clientId?: string;
			projectId?: string;
			invoiceType?: InvoiceType;
			financialYear?: string;
			fromDate?: string;
			toDate?: string;
			search?: string;
			limit?: number;
			offset?: number;
		}
	): Promise<{ rows: FinanceInvoice[]; count: number }> {
		const where: any = { companyId };

		if (options?.status) {
			where.status = options.status;
		}

		if (options?.clientId) {
			where.clientId = options.clientId;
		}

		if (options?.projectId) {
			where.projectId = options.projectId;
		}

		if (options?.invoiceType) {
			where.invoiceType = options.invoiceType;
		}

		if (options?.financialYear) {
			where.financialYear = options.financialYear;
		}

		if (options?.fromDate || options?.toDate) {
			where.invoiceDate = {};
			if (options?.fromDate) {
				where.invoiceDate[Op.gte] = new Date(options.fromDate);
			}
			if (options?.toDate) {
				where.invoiceDate[Op.lte] = new Date(options.toDate);
			}
		}

		if (options?.search) {
			where[Op.or] = [
				{ invoiceNumber: { [Op.iLike]: `%${options.search}%` } },
				{ '$client.name$': { [Op.iLike]: `%${options.search}%` } },
			];
		}

		return this.invoiceRepository.findAndCountAll({
			where,
			include: [
				{
					model: FinanceClient,
					as: 'client',
					attributes: ['id', 'name', 'email'],
				},
			],
			limit: options?.limit || 50,
			offset: options?.offset || 0,
			order: [['invoiceDate', 'DESC']],
		});
	}

	async findOne(id: string, companyId: number): Promise<FinanceInvoice> {
		const invoice = await this.invoiceRepository.findOne({
			where: { id, companyId: Number(companyId) },
			include: [
				{ model: FinanceClient, as: 'client' },
				{
					model: FinanceInvoiceLineItem,
					as: 'lineItems',
					required: false,
					separate: true,
					order: [['sortOrder', 'ASC']],
				},
				{
					model: FinanceInvoicePayment,
					as: 'payments',
					required: false,
					separate: true,
					order: [['paymentDate', 'DESC']],
				},
			],
		});

		if (!invoice) {
			throw new NotFoundException(`Invoice with ID ${id} not found`);
		}

		return invoice;
	}

	async update(
		id: string,
		companyId: number,
		userId: number,
		updateInvoiceDto: UpdateInvoiceDto
	): Promise<FinanceInvoice> {
		const invoice = await this.findOne(id, companyId);

		// Don't allow updates to paid invoices
		if (invoice.status === InvoiceStatus.PAID) {
			throw new BadRequestException('Cannot update a paid invoice');
		}

		const { lineItems, saveAsDraft: _saveAsDraft, ...invoiceData } = updateInvoiceDto;

		// Prepare update data with proper date conversion; omit non-DB fields (e.g. saveAsDraft)
		const updateData: any = { ...invoiceData };
		if (invoiceData.invoiceDate) {
			updateData.invoiceDate = new Date(invoiceData.invoiceDate);
		}
		if (invoiceData.dueDate) {
			updateData.dueDate = new Date(invoiceData.dueDate);
		}

		// Update invoice data and line items in a transaction so we don't leave invoice without line items on failure
		const sequelize = this.invoiceRepository.sequelize;
		const runUpdate = async (tx?: Transaction) => {
			await invoice.update(updateData, tx ? { transaction: tx } : {});
			if (lineItems?.length) {
				await this.lineItemRepository.destroy({
					where: { invoiceId: id },
					...(tx ? { transaction: tx } : {}),
				});
				const calculatedLineItems = lineItems.map((item, index) => {
					const amounts = calculateLineItemAmount(
						item.quantity,
						item.rate,
						item.discountPercent || 0,
						item.taxRate || 0
					);
					return { ...item, sortOrder: index, ...amounts };
				});
				const totals = calculateInvoiceTotals(
					calculatedLineItems,
					invoice.shippingTotal || 0
				);
				await Promise.all(
					calculatedLineItems.map((item) => {
						const { id: _id, ...lineItemData } = item as any;
						return this.lineItemRepository.create(
							{ ...lineItemData, invoiceId: id },
							tx ? { transaction: tx } : {}
						);
					})
				);
				await invoice.update(
					{
						...totals,
						balanceDue: totals.totalAmount - invoice.paidAmount,
					},
					tx ? { transaction: tx } : {}
				);
			}
		};
		if (sequelize) {
			await sequelize.transaction((t) => runUpdate(t));
		} else {
			await runUpdate();
		}

		await this.logActivity(
			id,
			userId,
			InvoiceActivityType.UPDATED,
			'Invoice updated'
		);

		return this.findOne(id, companyId);
	}

	async remove(id: string, companyId: number): Promise<void> {
		const invoice = await this.findOne(id, companyId);

		if (invoice.status === InvoiceStatus.PAID) {
			throw new BadRequestException('Cannot delete a paid invoice');
		}

		await invoice.destroy();
	}

	async markAsSent(
		id: string,
		companyId: number,
		userId: number
	): Promise<FinanceInvoice> {
		const invoice = await this.findOne(id, companyId);

		await invoice.update({
			status: InvoiceStatus.SENT,
			sentAt: new Date(),
		});

		await this.logActivity(
			id,
			userId,
			InvoiceActivityType.SENT,
			'Invoice marked as sent'
		);

		return invoice;
	}

	async markAsPaid(
		id: string,
		companyId: number,
		userId: number
	): Promise<FinanceInvoice> {
		const invoice = await this.findOne(id, companyId);

		const balanceDue = invoice.balanceDue || invoice.totalAmount;

		// Record full payment
		await this.paymentRepository.create({
			invoiceId: id,
			amount: balanceDue,
			paymentDate: new Date(),
			paymentMethod: PaymentMethod.BANK_TRANSFER,
		});

		await invoice.update({
			status: InvoiceStatus.PAID,
			paidAmount: invoice.totalAmount,
			balanceDue: 0,
			paidAt: new Date(),
		});

		await this.logActivity(
			id,
			userId,
			InvoiceActivityType.PAYMENT_RECEIVED,
			`Full payment of ${balanceDue} received`
		);

		return this.findOne(id, companyId);
	}

	async recordPayment(
		id: string,
		companyId: number,
		userId: number,
		paymentDto: RecordPaymentDto
	): Promise<FinanceInvoice> {
		const invoice = await this.findOne(id, companyId);

		if (invoice.status === InvoiceStatus.PAID) {
			throw new BadRequestException('Invoice is already fully paid');
		}

		if (paymentDto.amount > invoice.balanceDue) {
			throw new BadRequestException(
				`Payment amount exceeds balance due (${invoice.balanceDue})`
			);
		}

		// Record payment
		await this.paymentRepository.create({
			invoiceId: id,
			...paymentDto,
			paymentDate: new Date(paymentDto.paymentDate),
		});

		const newPaidAmount = Number(invoice.paidAmount) + Number(paymentDto.amount);
		const newBalanceDue = Number(invoice.totalAmount) - newPaidAmount;
		const isFullyPaid = newBalanceDue <= 0;

		await invoice.update({
			status: isFullyPaid
				? InvoiceStatus.PAID
				: InvoiceStatus.PARTIALLY_PAID,
			paidAmount: newPaidAmount,
			balanceDue: newBalanceDue,
			paidAt: isFullyPaid ? new Date() : null,
		});

		await this.logActivity(
			id,
			userId,
			InvoiceActivityType.PAYMENT_RECEIVED,
			`Payment of ${paymentDto.amount} received`
		);

		return this.findOne(id, companyId);
	}

	async duplicate(
		id: string,
		companyId: number,
		userId: number
	): Promise<FinanceInvoice> {
		const original = await this.findOne(id, companyId);

		const lineItems = original.lineItems?.map((item) => ({
			description: item.description,
			quantity: item.quantity,
			unit: item.unit,
			rate: item.rate,
			sacCode: item.sacCode,
			hsnCode: item.hsnCode,
			taxName: item.taxName,
			taxRate: item.taxRate,
			discountPercent: item.discountPercent,
		})) || [];

		return this.create(companyId, userId, {
			clientId: original.clientId,
			projectId: original.projectId,
			invoiceType: original.invoiceType,
			title: original.title,
			description: original.description,
			invoiceDate: new Date().toISOString(),
			paymentTerms: original.paymentTerms,
			currency: original.currency,
			language: original.language,
			shippingTotal: original.shippingTotal,
			notes: original.notes,
			footerNotes: original.footerNotes,
			lineItems,
			saveAsDraft: true,
		});
	}

	async getActivities(
		id: string,
		companyId: number
	): Promise<FinanceInvoiceActivity[]> {
		// Verify invoice exists
		await this.findOne(id, companyId);

		return this.activityRepository.findAll({
			where: { invoiceId: id },
			order: [['createdAt', 'DESC']],
		});
	}

	private async logActivity(
		invoiceId: string,
		userId: number,
		activityType: InvoiceActivityType,
		description: string,
		metadata?: object
	): Promise<void> {
		await this.activityRepository.create({
			invoiceId,
			userId,
			activityType,
			description,
			metadata,
		});
	}

	/**
	 * Check and update overdue invoices
	 * Should be called via a scheduled job
	 */
	async updateOverdueInvoices(companyId?: number): Promise<number> {
		const where: any = {
			status: {
				[Op.in]: [InvoiceStatus.SENT, InvoiceStatus.PARTIALLY_PAID],
			},
			dueDate: {
				[Op.lt]: new Date(),
			},
		};

		if (companyId) {
			where.companyId = companyId;
		}

		const [count] = await this.invoiceRepository.update(
			{ status: InvoiceStatus.OVERDUE },
			{ where }
		);

		return count;
	}
}
