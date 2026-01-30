import { FinanceSettings } from './entities/finance-settings.entity';
import { FinanceSequence } from './entities/finance-sequence.entity';
import { FinanceTaxRate } from './entities/finance-tax-rate.entity';
import { FinanceSavedItem } from './entities/finance-saved-item.entity';

export const settingsProviders = [
	{
		provide: 'FINANCE_SETTINGS_REPOSITORY',
		useValue: FinanceSettings,
	},
	{
		provide: 'FINANCE_SEQUENCE_REPOSITORY',
		useValue: FinanceSequence,
	},
	{
		provide: 'FINANCE_TAX_RATE_REPOSITORY',
		useValue: FinanceTaxRate,
	},
	{
		provide: 'FINANCE_SAVED_ITEM_REPOSITORY',
		useValue: FinanceSavedItem,
	},
];
