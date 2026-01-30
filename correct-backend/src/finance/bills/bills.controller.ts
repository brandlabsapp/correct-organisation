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
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { RecordBillPaymentDto } from './dto/record-bill-payment.dto';
import { BillStatus } from './entities/finance-bill.entity';
import { SequenceService } from '../settings/sequence.service';

@Controller('finance/bills')
export class BillsController {
	constructor(
		private readonly billsService: BillsService,
		private readonly sequenceService: SequenceService
	) {}

	@Post()
	create(@Req() req: any, @Body() createBillDto: CreateBillDto) {
		const companyId = req.query.company || req.body.companyId;
		return this.billsService.create(companyId, createBillDto);
	}

	@Get()
	findAll(
		@Req() req: any,
		@Query('status') status?: BillStatus,
		@Query('vendorId') vendorId?: string,
		@Query('projectId') projectId?: string,
		@Query('financialYear') financialYear?: string,
		@Query('fromDate') fromDate?: string,
		@Query('toDate') toDate?: string,
		@Query('search') search?: string,
		@Query('limit') limit?: string,
		@Query('offset') offset?: string
	) {
		const companyId = req.query.company;
		return this.billsService.findAll(companyId, {
			status,
			vendorId,
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
	previewNumber(@Req() req: any) {
		const companyId = req.query.company;
		return this.sequenceService.previewNextNumber(companyId, 'bil');
	}

	@Get(':id')
	findOne(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.billsService.findOne(id, companyId);
	}

	@Put(':id')
	update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateBillDto: UpdateBillDto
	) {
		const companyId = req.query.company;
		return this.billsService.update(id, companyId, updateBillDto);
	}

	@Delete(':id')
	remove(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.billsService.remove(id, companyId);
	}

	@Post(':id/mark-paid')
	markAsPaid(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.billsService.markAsPaid(id, companyId);
	}

	@Post(':id/payments')
	recordPayment(
		@Req() req: any,
		@Param('id') id: string,
		@Body() paymentDto: RecordBillPaymentDto
	) {
		const companyId = req.query.company;
		return this.billsService.recordPayment(id, companyId, paymentDto);
	}
}
