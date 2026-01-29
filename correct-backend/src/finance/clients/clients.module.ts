import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { clientsProviders } from './clients.provider';

@Module({
	controllers: [ClientsController],
	providers: [ClientsService, ...clientsProviders],
	exports: [ClientsService, ...clientsProviders],
})
export class ClientsModule {}
