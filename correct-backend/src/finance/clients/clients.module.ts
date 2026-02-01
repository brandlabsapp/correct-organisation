import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { clientsProviders } from './clients.provider';
import { CompanyModule } from '@/company/company.module';

@Module({
	imports: [CompanyModule],
	controllers: [ClientsController],
	providers: [ClientsService, ...clientsProviders],
	exports: [ClientsService, ...clientsProviders],
})
export class ClientsModule {}
