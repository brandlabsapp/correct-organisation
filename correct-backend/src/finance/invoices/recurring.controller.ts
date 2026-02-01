import {
	Controller,
	Get,
	Post,
	Put,
	Delete,
	Body,
	Param,
	Query,
	Req,
} from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { CreateRecurringProfileDto } from './dto/create-recurring-profile.dto';
import { RecurringStatus } from './entities/finance-recurring-profile.entity';
import { CompanyService } from '@/company/company.service';

@Controller('finance/recurring')
export class RecurringController {
	constructor(
		private readonly recurringService: RecurringService,
		private readonly companyService: CompanyService,
	) {}

	@Post()
	async create(@Req() req: any, @Body() dto: CreateRecurringProfileDto) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		const userId = req.user?.id || 1;
		return this.recurringService.create(company.id, userId, dto);
	}

	@Get()
	async findAll(
		@Req() req: any,
		@Query('status') status?: RecurringStatus,
		@Query('clientId') clientId?: string,
		@Query('limit') limit?: string,
		@Query('offset') offset?: string
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.recurringService.findAll(company.id, {
			status,
			clientId,
			limit: limit ? parseInt(limit, 10) : undefined,
			offset: offset ? parseInt(offset, 10) : undefined,
		});
	}

	@Get(':id')
	async findOne(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.recurringService.findOne(id, company.id);
	}

	@Put(':id')
	async update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() dto: Partial<CreateRecurringProfileDto>
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.recurringService.update(id, company.id, dto);
	}

	@Post(':id/pause')
	async pause(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.recurringService.pause(id, company.id);
	}

	@Post(':id/resume')
	async resume(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.recurringService.resume(id, company.id);
	}

	@Delete(':id')
	async delete(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.recurringService.delete(id, company.id);
	}

	@Post('process')
	async processProfiles(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.recurringService.processDueProfiles(company.id);
	}
}
