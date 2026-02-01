import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SequenceService } from './sequence.service';
import { settingsProviders } from './settings.provider';
import { CompanyModule } from '@/company/company.module';

@Module({
	imports: [CompanyModule],
	controllers: [SettingsController],
	providers: [SettingsService, SequenceService, ...settingsProviders],
	exports: [SettingsService, SequenceService, ...settingsProviders],
})
export class SettingsModule {}
