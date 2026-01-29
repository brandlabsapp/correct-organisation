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

@Controller('finance/clients')
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Post()
	create(@Req() req: any, @Body() createClientDto: CreateClientDto) {
		const companyId = req.query.company || req.body.companyId;
		return this.clientsService.create(companyId, createClientDto);
	}

	@Get()
	findAll(
		@Req() req: any,
		@Query('clientType') clientType?: ClientType,
		@Query('isActive') isActive?: string,
		@Query('isArchived') isArchived?: string,
		@Query('search') search?: string,
		@Query('limit') limit?: string,
		@Query('offset') offset?: string
	) {
		const companyId = req.query.company;
		return this.clientsService.findAll(companyId, {
			clientType,
			isActive: isActive ? isActive === 'true' : undefined,
			isArchived: isArchived ? isArchived === 'true' : undefined,
			search,
			limit: limit ? parseInt(limit, 10) : undefined,
			offset: offset ? parseInt(offset, 10) : undefined,
		});
	}

	@Get(':id')
	findOne(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.clientsService.findOne(id, companyId);
	}

	@Put(':id')
	update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateClientDto: UpdateClientDto
	) {
		const companyId = req.query.company;
		return this.clientsService.update(id, companyId, updateClientDto);
	}

	@Delete(':id')
	remove(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.clientsService.remove(id, companyId);
	}

	@Post(':id/archive')
	archive(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.clientsService.archive(id, companyId);
	}

	@Post(':id/unarchive')
	unarchive(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.clientsService.unarchive(id, companyId);
	}
}
