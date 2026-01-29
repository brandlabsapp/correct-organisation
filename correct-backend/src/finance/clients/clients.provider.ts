import { FinanceClient } from './entities/finance-client.entity';

export const clientsProviders = [
	{
		provide: 'FINANCE_CLIENT_REPOSITORY',
		useValue: FinanceClient,
	},
];
