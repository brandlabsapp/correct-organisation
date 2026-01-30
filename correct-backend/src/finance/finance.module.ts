import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';
import { BillsModule } from './bills/bills.module';
import { EstimatesModule } from './estimates/estimates.module';
import { SettingsModule } from './settings/settings.module';
import { ReportsModule } from './reports/reports.module';

@Module({
	imports: [
		ClientsModule,
		InvoicesModule,
		BillsModule,
		EstimatesModule,
		SettingsModule,
		ReportsModule,
	],
	exports: [
		ClientsModule,
		InvoicesModule,
		BillsModule,
		EstimatesModule,
		SettingsModule,
		ReportsModule,
	],
})
export class FinanceModule {}
