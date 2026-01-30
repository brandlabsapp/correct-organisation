import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { FinanceClient, ClientType } from './entities/finance-client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Op } from 'sequelize';

@Injectable()
export class ClientsService {
	constructor(
		@Inject('FINANCE_CLIENT_REPOSITORY')
		private readonly clientRepository: typeof FinanceClient
	) {}

	async create(
		companyId: number,
		createClientDto: CreateClientDto
	): Promise<FinanceClient> {
		return this.clientRepository.create({
			...createClientDto,
			companyId,
		});
	}

	async findAll(
		companyId: number,
		options?: {
			clientType?: ClientType;
			isActive?: boolean;
			isArchived?: boolean;
			search?: string;
			limit?: number;
			offset?: number;
		}
	): Promise<{ rows: FinanceClient[]; count: number }> {
		const where: any = { companyId };

		if (options?.clientType) {
			where.clientType = options.clientType;
		}

		if (options?.isActive !== undefined) {
			where.isActive = options.isActive;
		}

		if (options?.isArchived !== undefined) {
			where.isArchived = options.isArchived;
		}

		if (options?.search) {
			where[Op.or] = [
				{ name: { [Op.iLike]: `%${options.search}%` } },
				{ email: { [Op.iLike]: `%${options.search}%` } },
				{ phone: { [Op.iLike]: `%${options.search}%` } },
			];
		}

		return this.clientRepository.findAndCountAll({
			where,
			limit: options?.limit || 50,
			offset: options?.offset || 0,
			order: [['createdAt', 'DESC']],
		});
	}

	async findOne(id: string, companyId: number): Promise<FinanceClient> {
		const client = await this.clientRepository.findOne({
			where: { id, companyId },
		});

		if (!client) {
			throw new NotFoundException(`Client with ID ${id} not found`);
		}

		return client;
	}

	async update(
		id: string,
		companyId: number,
		updateClientDto: UpdateClientDto
	): Promise<FinanceClient> {
		const client = await this.findOne(id, companyId);
		await client.update(updateClientDto);
		return client;
	}

	async remove(id: string, companyId: number): Promise<void> {
		const client = await this.findOne(id, companyId);
		await client.destroy();
	}

	async archive(id: string, companyId: number): Promise<FinanceClient> {
		return this.update(id, companyId, { isArchived: true });
	}

	async unarchive(id: string, companyId: number): Promise<FinanceClient> {
		return this.update(id, companyId, { isArchived: false });
	}
}
