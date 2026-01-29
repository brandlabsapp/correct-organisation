import { Module, forwardRef } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { InvoicesModule } from '../invoices/invoices.module';
import { BillsModule } from '../bills/bills.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
	imports: [
		forwardRef(() => InvoicesModule),
		forwardRef(() => BillsModule),
		forwardRef(() => ClientsModule),
	],
	controllers: [ReportsController],
	providers: [ReportsService],
	exports: [ReportsService],
})
export class ReportsModule {}
