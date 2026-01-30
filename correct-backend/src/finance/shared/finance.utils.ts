/**
 * Finance utility functions
 */

/**
 * Get current financial year code
 * Indian financial year runs from April 1 to March 31
 * Returns format: FY2526 (for year 2025-26)
 */
export function getCurrentFinancialYear(): string {
	const now = new Date();
	const month = now.getMonth(); // 0-indexed (0 = January)
	const year = now.getFullYear();

	// Financial year starts in April (month 3)
	// If current month is Jan-Mar, FY started previous year
	const fyStartYear = month < 3 ? year - 1 : year;
	const fyEndYear = fyStartYear + 1;

	// Return format: FY2526 (for 2025-26)
	return `FY${String(fyStartYear).slice(-2)}${String(fyEndYear).slice(-2)}`;
}

/**
 * Get financial year from a specific date
 */
export function getFinancialYearFromDate(date: Date): string {
	const month = date.getMonth();
	const year = date.getFullYear();

	const fyStartYear = month < 3 ? year - 1 : year;
	const fyEndYear = fyStartYear + 1;

	return `FY${String(fyStartYear).slice(-2)}${String(fyEndYear).slice(-2)}`;
}

/**
 * Get financial year date range
 */
export function getFinancialYearRange(fyCode?: string): {
	start: Date;
	end: Date;
} {
	let startYear: number;

	if (fyCode) {
		// Parse FY code like "FY2526" -> start year 2025
		const startYearShort = parseInt(fyCode.substring(2, 4), 10);
		startYear = startYearShort >= 50 ? 1900 + startYearShort : 2000 + startYearShort;
	} else {
		const now = new Date();
		const month = now.getMonth();
		const year = now.getFullYear();
		startYear = month < 3 ? year - 1 : year;
	}

	return {
		start: new Date(startYear, 3, 1), // April 1
		end: new Date(startYear + 1, 2, 31), // March 31
	};
}

/**
 * Check if a date is within a financial year
 */
export function isDateInFinancialYear(date: Date, fyCode: string): boolean {
	const { start, end } = getFinancialYearRange(fyCode);
	return date >= start && date <= end;
}

/**
 * Get sequence key for document numbering
 */
export function getSequenceKey(
	documentType: 'inv' | 'exp' | 'bil' | 'est',
	financialYear?: string
): string {
	const fy = financialYear || getCurrentFinancialYear();
	return `${documentType}_${fy}`;
}

/**
 * Format document number
 * Examples:
 *   - INV-FY2526-0001 (Indian invoice)
 *   - EXP-FY2526-0001 (Export invoice)
 *   - BIL-FY2526-0001 (Bill)
 *   - EST-FY2526-0001 (Estimate)
 */
export function formatDocumentNumber(
	prefix: string,
	financialYear: string,
	sequenceNumber: number,
	padding: number = 4
): string {
	const paddedNumber = String(sequenceNumber).padStart(padding, '0');
	return `${prefix}-${financialYear}-${paddedNumber}`;
}

/**
 * Calculate due date based on payment terms
 */
export function calculateDueDate(
	invoiceDate: Date,
	paymentTerms: string
): Date | null {
	const date = new Date(invoiceDate);

	switch (paymentTerms) {
		case 'due_on_receipt':
			return date;
		case 'net_7':
			date.setDate(date.getDate() + 7);
			return date;
		case 'net_15':
			date.setDate(date.getDate() + 15);
			return date;
		case 'net_30':
			date.setDate(date.getDate() + 30);
			return date;
		case 'net_45':
			date.setDate(date.getDate() + 45);
			return date;
		case 'net_60':
			date.setDate(date.getDate() + 60);
			return date;
		case 'custom':
			return null;
		default:
			date.setDate(date.getDate() + 30);
			return date;
	}
}

/**
 * Format currency amount
 */
export function formatCurrency(
	amount: number,
	currencyCode: string = 'INR'
): string {
	const locales: Record<string, string> = {
		INR: 'en-IN',
		USD: 'en-US',
		EUR: 'de-DE',
		GBP: 'en-GB',
	};

	return new Intl.NumberFormat(locales[currencyCode] || 'en-IN', {
		style: 'currency',
		currency: currencyCode,
	}).format(amount);
}

/**
 * Calculate line item amount
 */
export function calculateLineItemAmount(
	quantity: number,
	rate: number,
	discountPercent: number = 0,
	taxRate: number = 0
): {
	amount: number;
	discountAmount: number;
	taxAmount: number;
	totalAmount: number;
} {
	const amount = quantity * rate;
	const discountAmount = (amount * discountPercent) / 100;
	const amountAfterDiscount = amount - discountAmount;
	const taxAmount = (amountAfterDiscount * taxRate) / 100;
	const totalAmount = amountAfterDiscount + taxAmount;

	return {
		amount: parseFloat(amount.toFixed(2)),
		discountAmount: parseFloat(discountAmount.toFixed(2)),
		taxAmount: parseFloat(taxAmount.toFixed(2)),
		totalAmount: parseFloat(totalAmount.toFixed(2)),
	};
}

/**
 * Calculate invoice totals from line items
 */
export function calculateInvoiceTotals(
	lineItems: Array<{
		amount: number;
		discountAmount: number;
		taxAmount: number;
		totalAmount: number;
	}>,
	shippingTotal: number = 0
): {
	subtotal: number;
	discountTotal: number;
	taxTotal: number;
	totalAmount: number;
} {
	const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
	const discountTotal = lineItems.reduce(
		(sum, item) => sum + item.discountAmount,
		0
	);
	const taxTotal = lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
	const totalAmount =
		subtotal - discountTotal + taxTotal + shippingTotal;

	return {
		subtotal: parseFloat(subtotal.toFixed(2)),
		discountTotal: parseFloat(discountTotal.toFixed(2)),
		taxTotal: parseFloat(taxTotal.toFixed(2)),
		totalAmount: parseFloat(totalAmount.toFixed(2)),
	};
}

/**
 * Supported currencies
 */
export const CURRENCIES = [
	{ code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
	{ code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
	{ code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
	{ code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
	{ code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
	{ code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
	{ code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
	{ code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
	{ code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
];
