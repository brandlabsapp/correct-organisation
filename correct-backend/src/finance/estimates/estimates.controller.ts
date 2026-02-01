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
import { EstimatesService } from './estimates.service';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { EstimateStatus } from './entities/finance-estimate.entity';
import { SequenceService } from '../settings/sequence.service';
import { CompanyService } from '@/company/company.service';

@Controller('finance/estimates')
export class EstimatesController {
	constructor(
		private readonly estimatesService: EstimatesService,
		private readonly sequenceService: SequenceService,
		private readonly companyService: CompanyService,
	) {}

	@Post()
	async create(@Req() req: any, @Body() createEstimateDto: CreateEstimateDto) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.estimatesService.create(company.id, createEstimateDto);
	}

	@Get()
	async findAll(
		@Req() req: any,
		@Query('status') status?: EstimateStatus,
		@Query('clientId') clientId?: string,
		@Query('projectId') projectId?: string,
		@Query('financialYear') financialYear?: string,
		@Query('fromDate') fromDate?: string,
		@Query('toDate') toDate?: string,
		@Query('search') search?: string,
		@Query('limit') limit?: string,
		@Query('offset') offset?: string
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.estimatesService.findAll(company.id, {
			status,
			clientId,
			projectId,
			financialYear,
			fromDate,
			toDate,
			search,
			limit: limit ? parseInt(limit, 10) : undefined,
			offset: offset ? parseInt(offset, 10) : undefined,
		});
	}

	@Get('preview-number')
	async previewNumber(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.sequenceService.previewNextNumber(company.id, 'est');
	}

	@Get(':id')
	async findOne(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.estimatesService.findOne(id, company.id);
	}

	@Put(':id')
	async update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateEstimateDto: UpdateEstimateDto
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.estimatesService.update(id, company.id, updateEstimateDto);
	}

	@Delete(':id')
	async remove(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.estimatesService.remove(id, company.id);
	}

	@Post(':id/mark-sent')
	async markAsSent(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.estimatesService.markAsSent(id, company.id);
	}

	@Post(':id/accept')
	async markAsAccepted(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.estimatesService.markAsAccepted(id, company.id);
	}

	@Post(':id/reject')
	async markAsRejected(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.estimatesService.markAsRejected(id, company.id);
	}

	@Post(':id/convert-to-invoice')
	async convertToInvoice(
		@Req() req: any,
		@Param('id') id: string,
		@Query('isExport') isExport?: string
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		const userId = req.user?.id || 1;
		return this.estimatesService.convertToInvoice(
			id,
			company.id,
			userId,
			isExport === 'true'
		);
	}
}
