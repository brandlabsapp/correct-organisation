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

@Controller('finance/estimates')
export class EstimatesController {
	constructor(
		private readonly estimatesService: EstimatesService,
		private readonly sequenceService: SequenceService
	) {}

	@Post()
	create(@Req() req: any, @Body() createEstimateDto: CreateEstimateDto) {
		const companyId = req.query.company || req.body.companyId;
		return this.estimatesService.create(companyId, createEstimateDto);
	}

	@Get()
	findAll(
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
		const companyId = req.query.company;
		return this.estimatesService.findAll(companyId, {
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
	previewNumber(@Req() req: any) {
		const companyId = req.query.company;
		return this.sequenceService.previewNextNumber(companyId, 'est');
	}

	@Get(':id')
	findOne(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.estimatesService.findOne(id, companyId);
	}

	@Put(':id')
	update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() updateEstimateDto: UpdateEstimateDto
	) {
		const companyId = req.query.company;
		return this.estimatesService.update(id, companyId, updateEstimateDto);
	}

	@Delete(':id')
	remove(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.estimatesService.remove(id, companyId);
	}

	@Post(':id/mark-sent')
	markAsSent(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.estimatesService.markAsSent(id, companyId);
	}

	@Post(':id/accept')
	markAsAccepted(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.estimatesService.markAsAccepted(id, companyId);
	}

	@Post(':id/reject')
	markAsRejected(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.estimatesService.markAsRejected(id, companyId);
	}

	@Post(':id/convert-to-invoice')
	convertToInvoice(
		@Req() req: any,
		@Param('id') id: string,
		@Query('isExport') isExport?: string
	) {
		const companyId = req.query.company;
		const userId = req.user?.id || 1;
		return this.estimatesService.convertToInvoice(
			id,
			companyId,
			userId,
			isExport === 'true'
		);
	}
}
