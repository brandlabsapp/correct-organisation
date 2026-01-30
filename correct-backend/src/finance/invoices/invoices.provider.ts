import { FinanceInvoice } from './entities/finance-invoice.entity';
import { FinanceInvoiceLineItem } from './entities/finance-invoice-line-item.entity';
import { FinanceInvoicePayment } from './entities/finance-invoice-payment.entity';
import { FinanceInvoiceActivity } from './entities/finance-invoice-activity.entity';
import { FinanceRecurringProfile } from './entities/finance-recurring-profile.entity';

export const invoicesProviders = [
	{
		provide: 'FINANCE_INVOICE_REPOSITORY',
		useValue: FinanceInvoice,
	},
	{
		provide: 'FINANCE_INVOICE_LINE_ITEM_REPOSITORY',
		useValue: FinanceInvoiceLineItem,
	},
	{
		provide: 'FINANCE_INVOICE_PAYMENT_REPOSITORY',
		useValue: FinanceInvoicePayment,
	},
	{
		provide: 'FINANCE_INVOICE_ACTIVITY_REPOSITORY',
		useValue: FinanceInvoiceActivity,
	},
	{
		provide: 'FINANCE_RECURRING_PROFILE_REPOSITORY',
		useValue: FinanceRecurringProfile,
	},
];
