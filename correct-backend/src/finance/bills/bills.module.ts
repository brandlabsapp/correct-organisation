import { Module, forwardRef } from '@nestjs/common';
import { BillsController } from './bills.controller';
import { BillsService } from './bills.service';
import { billsProviders } from './bills.provider';
import { SettingsModule } from '../settings/settings.module';

@Module({
	imports: [forwardRef(() => SettingsModule)],
	controllers: [BillsController],
	providers: [BillsService, ...billsProviders],
	exports: [BillsService, ...billsProviders],
})
export class BillsModule {}
