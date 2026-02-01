import { Module, forwardRef } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { RecurringController } from './recurring.controller';
import { RecurringService } from './recurring.service';
import { invoicesProviders } from './invoices.provider';
import { SettingsModule } from '../settings/settings.module';
import { CompanyModule } from '@/company/company.module';

@Module({
	imports: [forwardRef(() => SettingsModule), CompanyModule],
	controllers: [InvoicesController, RecurringController],
	providers: [InvoicesService, RecurringService, ...invoicesProviders],
	exports: [InvoicesService, RecurringService, ...invoicesProviders],
})
export class InvoicesModule {}
