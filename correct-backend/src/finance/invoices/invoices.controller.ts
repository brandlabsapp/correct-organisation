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
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { InvoiceStatus, InvoiceType } from './entities/finance-invoice.entity';
import { SequenceService } from '../settings/sequence.service';
import { CompanyService } from '@/company/company.service';

@Controller('finance/invoices')
export class InvoicesController {
	constructor(
		private readonly invoicesService: InvoicesService,
		private readonly sequenceService: SequenceService,
		private readonly companyService: CompanyService,
	) {}

	@Post()
	async create(@Req() req: any, @Body() createInvoiceDto: CreateInvoiceDto) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		const userId = req.user?.id || 1; // TODO: Get from auth
		return this.invoicesService.create(company.id, userId, createInvoiceDto);
	}

	@Get()
	async findAll(
		@Req() req: any,
		@Query('status') status?: InvoiceStatus,
		@Query('clientId') clientId?: string,
		@Query('projectId') projectId?: string,
		@Query('invoiceType') invoiceType?: InvoiceType,
		@Query('financialYear') financialYear?: string,
		@Query('fromDate') fromDate?: string,
		@Query('toDate') toDate?: string,
		@Query('search') search?: string,
		@Query('limit') limit?: string,
		@Query('offset') offset?: string
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.invoicesService.findAll(company.id, {
			status,
			clientId,
			projectId,
			invoiceType,
			financialYear,
			fromDate,
			toDate,
			search,
			limit: limit ? parseInt(limit, 10) : undefined,
			offset: offset ? parseInt(offset, 10) : undefined,
		});
	}

	@Get('preview-number')
	async previewNumber(
		@Req() req: any,
		@Query('type') type: 'domestic' | 'export' = 'domestic'
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		const documentType = type === 'export' ? 'exp' : 'inv';
		return this.sequenceService.previewNextNumber(company.id, documentType);
	}

	@Get(':id')
	async findOne(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.invoicesService.findOne(id, company.id);
	}

	@Put(':id')
	async update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateInvoiceDto: UpdateInvoiceDto
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		const userId = req.user?.id || 1;
		return this.invoicesService.update(id, company.id, userId, updateInvoiceDto);
	}

	@Delete(':id')
	async remove(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.invoicesService.remove(id, company.id);
	}

	@Post(':id/mark-sent')
	async markAsSent(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		const userId = req.user?.id || 1;
		return this.invoicesService.markAsSent(id, company.id, userId);
	}

	@Post(':id/mark-paid')
	async markAsPaid(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		const userId = req.user?.id || 1;
		return this.invoicesService.markAsPaid(id, company.id, userId);
	}

	@Post(':id/payments')
	async recordPayment(
		@Req() req: any,
		@Param('id') id: string,
		@Body() paymentDto: RecordPaymentDto
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		const userId = req.user?.id || 1;
		return this.invoicesService.recordPayment(
			id,
			company.id,
			userId,
			paymentDto
		);
	}

	@Post(':id/duplicate')
	async duplicate(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		const userId = req.user?.id || 1;
		return this.invoicesService.duplicate(id, company.id, userId);
	}

	@Get(':id/activities')
	async getActivities(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.invoicesService.getActivities(id, company.id);
	}
}
