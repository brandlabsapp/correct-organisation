import { Module, forwardRef } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { billsProviders } from './bills.provider';
import { SettingsModule } from '../settings/settings.module';
import { CompanyModule } from '@/company/company.module';

@Module({
	imports: [forwardRef(() => SettingsModule), CompanyModule],
	controllers: [BillsController],
	providers: [BillsService, ...billsProviders],
	exports: [BillsService, ...billsProviders],
})
export class BillsModule {}
