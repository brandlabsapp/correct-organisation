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

@Controller('finance/invoices')
export class InvoicesController {
	constructor(
		private readonly invoicesService: InvoicesService,
		private readonly sequenceService: SequenceService
	) {}

	@Post()
	create(@Req() req: any, @Body() createInvoiceDto: CreateInvoiceDto) {
		const companyId = req.query.company || req.body.companyId;
		const userId = req.user?.id || 1; // TODO: Get from auth
		return this.invoicesService.create(companyId, userId, createInvoiceDto);
	}

	@Get()
	findAll(
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
		const companyId = req.query.company;
		return this.invoicesService.findAll(companyId, {
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
	previewNumber(
		@Req() req: any,
		@Query('type') type: 'domestic' | 'export' = 'domestic'
	) {
		const companyId = req.query.company;
		const documentType = type === 'export' ? 'exp' : 'inv';
		return this.sequenceService.previewNextNumber(companyId, documentType);
	}

	@Get(':id')
	findOne(@Req() req: any, @Param('id') id: string) {
		const companyId = parseInt(String(req.query.company), 10) || 0;
		return this.invoicesService.findOne(id, companyId);
	}

	@Put(':id')
	update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateInvoiceDto: UpdateInvoiceDto
	) {
		const companyId = parseInt(String(req.query.company), 10) || 0;
		const userId = req.user?.id || 1;
		return this.invoicesService.update(id, companyId, userId, updateInvoiceDto);
	}

	@Delete(':id')
	remove(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.invoicesService.remove(id, companyId);
	}

	@Post(':id/mark-sent')
	markAsSent(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		const userId = req.user?.id || 1;
		return this.invoicesService.markAsSent(id, companyId, userId);
	}

	@Post(':id/mark-paid')
	markAsPaid(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		const userId = req.user?.id || 1;
		return this.invoicesService.markAsPaid(id, companyId, userId);
	}

	@Post(':id/payments')
	recordPayment(
		@Req() req: any,
		@Param('id') id: string,
		@Body() paymentDto: RecordPaymentDto
	) {
		const companyId = req.query.company;
		const userId = req.user?.id || 1;
		return this.invoicesService.recordPayment(id, companyId, userId, paymentDto);
	}

	@Post(':id/duplicate')
	duplicate(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		const userId = req.user?.id || 1;
		return this.invoicesService.duplicate(id, companyId, userId);
	}

	@Get(':id/activities')
	getActivities(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.invoicesService.getActivities(id, companyId);
	}
}
