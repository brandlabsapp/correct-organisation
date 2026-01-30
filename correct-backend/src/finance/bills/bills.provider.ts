import { FinanceBill } from './entities/finance-bill.entity';
import { FinanceBillLineItem } from './entities/finance-bill-line-item.entity';
import { FinanceBillPayment } from './entities/finance-bill-payment.entity';

export const billsProviders = [
	{
		provide: 'FINANCE_BILL_REPOSITORY',
		useValue: FinanceBill,
	},
	{
		provide: 'FINANCE_BILL_LINE_ITEM_REPOSITORY',
		useValue: FinanceBillLineItem,
	},
	{
		provide: 'FINANCE_BILL_PAYMENT_REPOSITORY',
		useValue: FinanceBillPayment,
	},
];
