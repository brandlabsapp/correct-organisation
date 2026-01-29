import {
	Injectable,
	Inject,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import {
	FinanceRecurringProfile,
	RecurringFrequency,
	RecurringStatus,
} from './entities/finance-recurring-profile.entity';
import { InvoicesService } from './invoices.service';
import { FinanceClient } from '../clients/entities/finance-client.entity';
import { CreateRecurringProfileDto } from './dto/create-recurring-profile.dto';
import { InvoiceType } from './entities/finance-invoice.entity';
import { Op } from 'sequelize';

@Injectable()
export class RecurringService {
	constructor(
		@Inject('FINANCE_RECURRING_PROFILE_REPOSITORY')
		private readonly recurringRepository: typeof FinanceRecurringProfile,
		private readonly invoicesService: InvoicesService
	) {}

	async create(
		companyId: number,
		userId: number,
		dto: CreateRecurringProfileDto
	): Promise<FinanceRecurringProfile> {
		const nextRun = this.calculateNextRun(new Date(dto.startDate), dto.frequency);

		const profile = await this.recurringRepository.create({
			...dto,
			companyId,
			createdBy: userId,
			startDate: new Date(dto.startDate),
			endDate: dto.endDate ? new Date(dto.endDate) : null,
			nextRun,
			status: RecurringStatus.ACTIVE,
			occurrenceCount: 0,
			lineItemsJson: JSON.stringify(dto.lineItems),
		});

		return this.findOne(profile.id, companyId);
	}

	async findAll(
		companyId: number,
		options?: {
			status?: RecurringStatus;
			clientId?: string;
			limit?: number;
			offset?: number;
		}
	): Promise<{ rows: FinanceRecurringProfile[]; count: number }> {
		const where: any = { companyId };

		if (options?.status) {
			where.status = options.status;
		}

		if (options?.clientId) {
			where.clientId = options.clientId;
		}

		return this.recurringRepository.findAndCountAll({
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
			order: [['nextRun', 'ASC']],
		});
	}

	async findOne(id: string, companyId: number): Promise<FinanceRecurringProfile> {
		const profile = await this.recurringRepository.findOne({
			where: { id, companyId },
			include: [
				{
					model: FinanceClient,
					as: 'client',
				},
			],
		});

		if (!profile) {
			throw new NotFoundException(`Recurring profile with ID ${id} not found`);
		}

		return profile;
	}

	async update(
		id: string,
		companyId: number,
		dto: Partial<CreateRecurringProfileDto>
	): Promise<FinanceRecurringProfile> {
		const profile = await this.findOne(id, companyId);

		const updateData: any = { ...dto };

		if (dto.startDate) {
			updateData.startDate = new Date(dto.startDate);
		}
		if (dto.endDate) {
			updateData.endDate = new Date(dto.endDate);
		}
		if (dto.lineItems) {
			updateData.lineItemsJson = JSON.stringify(dto.lineItems);
		}
		if (dto.frequency || dto.startDate) {
			updateData.nextRun = this.calculateNextRun(
				updateData.startDate || profile.startDate,
				dto.frequency || profile.frequency
			);
		}

		await profile.update(updateData);
		return this.findOne(id, companyId);
	}

	async pause(id: string, companyId: number): Promise<FinanceRecurringProfile> {
		const profile = await this.findOne(id, companyId);
		await profile.update({ status: RecurringStatus.PAUSED });
		return profile;
	}

	async resume(id: string, companyId: number): Promise<FinanceRecurringProfile> {
		const profile = await this.findOne(id, companyId);

		// Calculate next run from now
		const nextRun = this.calculateNextRun(new Date(), profile.frequency);
		await profile.update({
			status: RecurringStatus.ACTIVE,
			nextRun,
		});

		return profile;
	}

	async delete(id: string, companyId: number): Promise<void> {
		const profile = await this.findOne(id, companyId);
		await profile.destroy();
	}

	/**
	 * Process all due recurring invoices
	 * This should be called by a cron job
	 */
	async processDueProfiles(companyId?: number): Promise<number> {
		const where: any = {
			status: RecurringStatus.ACTIVE,
			nextRun: {
				[Op.lte]: new Date(),
			},
		};

		if (companyId) {
			where.companyId = companyId;
		}

		const profiles = await this.recurringRepository.findAll({ where });
		let processedCount = 0;

		for (const profile of profiles) {
			try {
				await this.generateInvoiceFromProfile(profile);
				processedCount++;
			} catch (error) {
				console.error(
					`Error processing recurring profile ${profile.id}:`,
					error
				);
			}
		}

		return processedCount;
	}

	private async generateInvoiceFromProfile(
		profile: FinanceRecurringProfile
	): Promise<void> {
		const lineItems = JSON.parse(profile.lineItemsJson || '[]');

		// Create invoice
		await this.invoicesService.create(
			profile.companyId,
			profile.createdBy,
			{
				clientId: profile.clientId,
				invoiceType:
					profile.invoiceType === 'export'
						? InvoiceType.EXPORT
						: InvoiceType.DOMESTIC,
				invoiceDate: new Date().toISOString(),
				paymentTerms: profile.paymentTerms as any,
				currency: profile.currency,
				notes: profile.notes,
				lineItems: lineItems.map((item: any) => ({
					description: item.description,
					quantity: item.quantity,
					unit: item.unit,
					rate: item.rate,
					sacCode: item.sacCode,
					taxRate: item.taxRate || 0,
				})),
				saveAsDraft: !profile.autoSend,
			}
		);

		// Update profile
		const newOccurrenceCount = profile.occurrenceCount + 1;
		const nextRun = this.calculateNextRun(new Date(), profile.frequency);

		// Check if we should complete the profile
		let newStatus = profile.status;
		if (
			profile.maxOccurrences &&
			newOccurrenceCount >= profile.maxOccurrences
		) {
			newStatus = RecurringStatus.COMPLETED;
		}
		if (profile.endDate && nextRun > profile.endDate) {
			newStatus = RecurringStatus.COMPLETED;
		}

		await profile.update({
			lastRun: new Date(),
			nextRun,
			occurrenceCount: newOccurrenceCount,
			status: newStatus,
		});
	}

	private calculateNextRun(fromDate: Date, frequency: RecurringFrequency): Date {
		const next = new Date(fromDate);

		switch (frequency) {
			case RecurringFrequency.WEEKLY:
				next.setDate(next.getDate() + 7);
				break;
			case RecurringFrequency.BIWEEKLY:
				next.setDate(next.getDate() + 14);
				break;
			case RecurringFrequency.MONTHLY:
				next.setMonth(next.getMonth() + 1);
				break;
			case RecurringFrequency.QUARTERLY:
				next.setMonth(next.getMonth() + 3);
				break;
			case RecurringFrequency.HALF_YEARLY:
				next.setMonth(next.getMonth() + 6);
				break;
			case RecurringFrequency.YEARLY:
				next.setFullYear(next.getFullYear() + 1);
				break;
		}

		return next;
	}
}
