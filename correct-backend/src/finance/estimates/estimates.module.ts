import { Module, forwardRef } from '@nestjs/common';
import { EstimatesController } from './estimates.controller';
import { EstimatesService } from './estimates.service';
import { estimatesProviders } from './estimates.provider';
import { SettingsModule } from '../settings/settings.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { CompanyModule } from '@/company/company.module';

@Module({
	imports: [
		forwardRef(() => SettingsModule),
		forwardRef(() => InvoicesModule),
		CompanyModule,
	],
	controllers: [EstimatesController],
	providers: [EstimatesService, ...estimatesProviders],
	exports: [EstimatesService, ...estimatesProviders],
})
export class EstimatesModule {}
