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
import { CompanyService } from '@/company/company.service';

@Controller('finance/bills')
export class BillsController {
	constructor(
		private readonly billsService: BillsService,
		private readonly sequenceService: SequenceService,
		private readonly companyService: CompanyService,
	) {}

	@Post()
	async create(@Req() req: any, @Body() createBillDto: CreateBillDto) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.billsService.create(company.id, createBillDto);
	}

	@Get()
	async findAll(
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
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.billsService.findAll(company.id, {
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
	async previewNumber(@Req() req: any) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.sequenceService.previewNextNumber(company.id, 'bil');
	}

	@Get(':id')
	async findOne(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.billsService.findOne(id, company.id);
	}

	@Put(':id')
	async update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateBillDto: UpdateBillDto
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.billsService.update(id, company.id, updateBillDto);
	}

	@Delete(':id')
	async remove(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.billsService.remove(id, company.id);
	}

	@Post(':id/mark-paid')
	async markAsPaid(@Req() req: any, @Param('id') id: string) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.billsService.markAsPaid(id, company.id);
	}

	@Post(':id/payments')
	async recordPayment(
		@Req() req: any,
		@Param('id') id: string,
		@Body() paymentDto: RecordBillPaymentDto
	) {
		const company = await this.companyService.findOneByUuid(req.query.company);
		return this.billsService.recordPayment(id, company.id, paymentDto);
	}
}
