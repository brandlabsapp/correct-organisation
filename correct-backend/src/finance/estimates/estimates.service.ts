import {
	Injectable,
	Inject,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import {
	FinanceEstimate,
	EstimateStatus,
} from './entities/finance-estimate.entity';
import { FinanceEstimateLineItem } from './entities/finance-estimate-line-item.entity';
import { FinanceClient } from '../clients/entities/finance-client.entity';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { SequenceService } from '../settings/sequence.service';
import { InvoicesService } from '../invoices/invoices.service';
import {
	calculateLineItemAmount,
	calculateInvoiceTotals,
} from '../shared/finance.utils';
import { InvoiceType } from '../invoices/entities/finance-invoice.entity';
import { Op } from 'sequelize';

@Injectable()
export class EstimatesService {
	constructor(
		@Inject('FINANCE_ESTIMATE_REPOSITORY')
		private readonly estimateRepository: typeof FinanceEstimate,
		@Inject('FINANCE_ESTIMATE_LINE_ITEM_REPOSITORY')
		private readonly lineItemRepository: typeof FinanceEstimateLineItem,
		private readonly sequenceService: SequenceService,
		private readonly invoicesService: InvoicesService
	) {}

	async create(
		companyId: number,
		createEstimateDto: CreateEstimateDto
	): Promise<FinanceEstimate> {
		const { lineItems, saveAsDraft, ...estimateData } = createEstimateDto;

		// Generate estimate number
		const { number: estimateNumber, financialYear } =
			await this.sequenceService.generateNextNumber(companyId, 'est');

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

		// Calculate estimate totals
		const totals = calculateInvoiceTotals(calculatedLineItems, 0);

		// Create estimate
		const estimate = await this.estimateRepository.create({
			...estimateData,
			companyId,
			estimateNumber,
			financialYear,
			estimateDate: new Date(estimateData.estimateDate),
			expiryDate: estimateData.expiryDate
				? new Date(estimateData.expiryDate)
				: null,
			status: saveAsDraft ? EstimateStatus.DRAFT : EstimateStatus.DRAFT,
			...totals,
		});

		// Create line items
		await Promise.all(
			calculatedLineItems.map((item) =>
				this.lineItemRepository.create({
					...item,
					estimateId: estimate.id,
				})
			)
		);

		return this.findOne(estimate.id, companyId);
	}

	async findAll(
		companyId: number,
		options?: {
			status?: EstimateStatus;
			clientId?: string;
			projectId?: string;
			financialYear?: string;
			fromDate?: string;
			toDate?: string;
			search?: string;
			limit?: number;
			offset?: number;
		}
	): Promise<{ rows: FinanceEstimate[]; count: number }> {
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

		if (options?.financialYear) {
			where.financialYear = options.financialYear;
		}

		if (options?.fromDate || options?.toDate) {
			where.estimateDate = {};
			if (options?.fromDate) {
				where.estimateDate[Op.gte] = new Date(options.fromDate);
			}
			if (options?.toDate) {
				where.estimateDate[Op.lte] = new Date(options.toDate);
			}
		}

		if (options?.search) {
			where[Op.or] = [
				{ estimateNumber: { [Op.iLike]: `%${options.search}%` } },
			];
		}

		return this.estimateRepository.findAndCountAll({
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
			order: [['estimateDate', 'DESC']],
		});
	}

	async findOne(id: string, companyId: number): Promise<FinanceEstimate> {
		const estimate = await this.estimateRepository.findOne({
			where: { id, companyId },
			include: [
				{
					model: FinanceClient,
					as: 'client',
				},
				{
					model: FinanceEstimateLineItem,
					as: 'lineItems',
				},
			],
		});

		if (!estimate) {
			throw new NotFoundException(`Estimate with ID ${id} not found`);
		}

		return estimate;
	}

	async update(
		id: string,
		companyId: number,
		updateEstimateDto: UpdateEstimateDto
	): Promise<FinanceEstimate> {
		const estimate = await this.findOne(id, companyId);

		if (estimate.convertedToInvoice) {
			throw new BadRequestException(
				'Cannot update an estimate that has been converted to an invoice'
			);
		}

		const { lineItems, ...estimateData } = updateEstimateDto;

		// Prepare update data
		const updateData: any = { ...estimateData };
		if (estimateData.estimateDate) {
			updateData.estimateDate = new Date(estimateData.estimateDate);
		}
		if (estimateData.expiryDate) {
			updateData.expiryDate = new Date(estimateData.expiryDate);
		}

		await estimate.update(updateData);

		if (lineItems) {
			await this.lineItemRepository.destroy({
				where: { estimateId: id },
			});

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

			const totals = calculateInvoiceTotals(calculatedLineItems, 0);

			await Promise.all(
				calculatedLineItems.map((item) =>
					this.lineItemRepository.create({
						...item,
						estimateId: id,
					})
				)
			);

			await estimate.update(totals);
		}

		return this.findOne(id, companyId);
	}

	async remove(id: string, companyId: number): Promise<void> {
		const estimate = await this.findOne(id, companyId);
		await estimate.destroy();
	}

	async markAsSent(id: string, companyId: number): Promise<FinanceEstimate> {
		const estimate = await this.findOne(id, companyId);
		await estimate.update({ status: EstimateStatus.SENT });
		return estimate;
	}

	async markAsAccepted(id: string, companyId: number): Promise<FinanceEstimate> {
		const estimate = await this.findOne(id, companyId);
		await estimate.update({ status: EstimateStatus.ACCEPTED });
		return estimate;
	}

	async markAsRejected(id: string, companyId: number): Promise<FinanceEstimate> {
		const estimate = await this.findOne(id, companyId);
		await estimate.update({ status: EstimateStatus.REJECTED });
		return estimate;
	}

	async convertToInvoice(
		id: string,
		companyId: number,
		userId: number,
		isExport: boolean = false
	): Promise<{ estimate: FinanceEstimate; invoiceId: string }> {
		const estimate = await this.findOne(id, companyId);

		if (estimate.convertedToInvoice) {
			throw new BadRequestException(
				'This estimate has already been converted to an invoice'
			);
		}

		// Prepare line items for invoice
		const lineItems =
			estimate.lineItems?.map((item) => ({
				description: item.description,
				quantity: Number(item.quantity),
				unit: item.unit,
				rate: Number(item.rate),
				sacCode: item.sacCode,
				hsnCode: item.hsnCode,
				taxName: item.taxName,
				taxRate: Number(item.taxRate) || 0,
				discountPercent: Number(item.discountPercent) || 0,
			})) || [];

		// Create invoice from estimate
		const invoice = await this.invoicesService.create(companyId, userId, {
			clientId: estimate.clientId,
			projectId: estimate.projectId,
			invoiceType: isExport ? InvoiceType.EXPORT : InvoiceType.DOMESTIC,
			title: estimate.title,
			description: estimate.description,
			invoiceDate: new Date().toISOString(),
			currency: estimate.currency,
			notes: estimate.notes,
			lineItems,
			saveAsDraft: true,
		});

		// Update estimate as converted
		await estimate.update({
			convertedToInvoice: true,
			invoiceId: invoice.id,
			status: EstimateStatus.ACCEPTED,
		});

		return {
			estimate: await this.findOne(id, companyId),
			invoiceId: invoice.id,
		};
	}

	async updateExpiredEstimates(companyId?: number): Promise<number> {
		const where: any = {
			status: {
				[Op.in]: [EstimateStatus.DRAFT, EstimateStatus.SENT, EstimateStatus.VIEWED],
			},
			expiryDate: {
				[Op.lt]: new Date(),
			},
			convertedToInvoice: false,
		};

		if (companyId) {
			where.companyId = companyId;
		}

		const [count] = await this.estimateRepository.update(
			{ status: EstimateStatus.EXPIRED },
			{ where }
		);

		return count;
	}
}
