import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
	UseGuards,
	Req,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientType } from './entities/finance-client.entity';
import { CompanyService } from '@/company/company.service';

@Controller('finance/clients')
export class ClientsController {
	constructor(
		private readonly clientsService: ClientsService,
		private readonly companyService: CompanyService,
	) {}

	@Post()
	async create(@Req() req: any, @Body() createClientDto: CreateClientDto) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.clientsService.create(company.id, createClientDto);
	}

	@Get()
	async findAll(
		@Req() req: any,
		@Query('clientType') clientType?: ClientType,
		@Query('isActive') isActive?: string,
		@Query('isArchived') isArchived?: string,
		@Query('search') search?: string,
		@Query('limit') limit?: string,
		@Query('offset') offset?: string
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.clientsService.findAll(company.id, {
			clientType,
			isActive: isActive ? isActive === 'true' : undefined,
			isArchived: isArchived ? isArchived === 'true' : undefined,
			search,
			limit: limit ? parseInt(limit, 10) : undefined,
			offset: offset ? parseInt(offset, 10) : undefined,
		});
	}

	@Get(':id')
	async findOne(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.clientsService.findOne(id, company.id);
	}

	@Put(':id')
	async update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateClientDto: UpdateClientDto
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.clientsService.update(id, company.id, updateClientDto);
	}

	@Delete(':id')
	async remove(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.clientsService.remove(id, company.id);
	}

	@Post(':id/archive')
	async archive(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.clientsService.archive(id, company.id);
	}

	@Post(':id/unarchive')
	async unarchive(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.clientsService.unarchive(id, company.id);
	}
}
