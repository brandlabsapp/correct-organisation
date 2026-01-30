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

@Controller('finance/recurring')
export class RecurringController {
	constructor(private readonly recurringService: RecurringService) {}

	@Post()
	create(@Req() req: any, @Body() dto: CreateRecurringProfileDto) {
		const companyId = req.query.company || req.body.companyId;
		const userId = req.user?.id || 1;
		return this.recurringService.create(companyId, userId, dto);
	}

	@Get()
	findAll(
		@Req() req: any,
		@Query('status') status?: RecurringStatus,
		@Query('clientId') clientId?: string,
		@Query('limit') limit?: string,
		@Query('offset') offset?: string
	) {
		const companyId = req.query.company;
		return this.recurringService.findAll(companyId, {
			status,
			clientId,
			limit: limit ? parseInt(limit, 10) : undefined,
			offset: offset ? parseInt(offset, 10) : undefined,
		});
	}

	@Get(':id')
	findOne(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.recurringService.findOne(id, companyId);
	}

	@Put(':id')
	update(
		@Req() req: any,
		@Param('id') id: string,
		@Body() dto: Partial<CreateRecurringProfileDto>
	) {
		const companyId = req.query.company;
		return this.recurringService.update(id, companyId, dto);
	}

	@Post(':id/pause')
	pause(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.recurringService.pause(id, companyId);
	}

	@Post(':id/resume')
	resume(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.recurringService.resume(id, companyId);
	}

	@Delete(':id')
	delete(@Req() req: any, @Param('id') id: string) {
		const companyId = req.query.company;
		return this.recurringService.delete(id, companyId);
	}

	@Post('process')
	processProfiles(@Req() req: any) {
		const companyId = req.query.company;
		return this.recurringService.processDueProfiles(
			companyId ? parseInt(companyId, 10) : undefined
		);
	}
}
