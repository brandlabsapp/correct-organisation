import { FinanceEstimate } from './entities/finance-estimate.entity';
import { FinanceEstimateLineItem } from './entities/finance-estimate-line-item.entity';

export const estimatesProviders = [
	{
		provide: 'FINANCE_ESTIMATE_REPOSITORY',
		useValue: FinanceEstimate,
	},
	{
		provide: 'FINANCE_ESTIMATE_LINE_ITEM_REPOSITORY',
		useValue: FinanceEstimateLineItem,
	},
];
