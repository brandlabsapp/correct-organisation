/**
 * CSV Export Utilities for Finance Module
 */

type ExportableData = Record<string, any>;

interface ExportConfig {
	filename: string;
	columns: {
		key: string;
		header: string;
		formatter?: (value: any, row: ExportableData) => string;
	}[];
}

/**
 * Convert array of objects to CSV string
 */
export function arrayToCsv(data: ExportableData[], config: ExportConfig): string {
	if (data.length === 0) return '';

	// Create header row
	const headers = config.columns.map((col) => `"${col.header}"`).join(',');

	// Create data rows
	const rows = data.map((row) => {
		return config.columns
			.map((col) => {
				let value = row[col.key];
				if (col.formatter) {
					value = col.formatter(value, row);
				}
				// Escape quotes and wrap in quotes
				if (value === null || value === undefined) {
					return '""';
				}
				return `"${String(value).replace(/"/g, '""')}"`;
			})
			.join(',');
	});

	return [headers, ...rows].join('\n');
}

/**
 * Download CSV file
 */
export function downloadCsv(csvContent: string, filename: string): void {
	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	const url = URL.createObjectURL(blob);

	link.setAttribute('href', url);
	link.setAttribute('download', `${filename}.csv`);
	link.style.visibility = 'hidden';
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * Export invoices to CSV
 */
export function exportInvoicesToCsv(invoices: any[]): void {
	const config: ExportConfig = {
		filename: `invoices-${new Date().toISOString().split('T')[0]}`,
		columns: [
			{ key: 'invoiceNumber', header: 'Invoice Number' },
			{
				key: 'client',
				header: 'Client',
				formatter: (client) => client?.name || '',
			},
			{
				key: 'invoiceDate',
				header: 'Invoice Date',
				formatter: (date) =>
					date ? new Date(date).toLocaleDateString() : '',
			},
			{
				key: 'dueDate',
				header: 'Due Date',
				formatter: (date) =>
					date ? new Date(date).toLocaleDateString() : '',
			},
			{ key: 'status', header: 'Status' },
			{ key: 'currency', header: 'Currency' },
			{
				key: 'totalAmount',
				header: 'Total Amount',
				formatter: (val) => Number(val).toFixed(2),
			},
			{
				key: 'paidAmount',
				header: 'Paid Amount',
				formatter: (val) => Number(val || 0).toFixed(2),
			},
			{
				key: 'balanceDue',
				header: 'Balance Due',
				formatter: (val) => Number(val || 0).toFixed(2),
			},
		],
	};

	const csvContent = arrayToCsv(invoices, config);
	downloadCsv(csvContent, config.filename);
}

/**
 * Export bills to CSV
 */
export function exportBillsToCsv(bills: any[]): void {
	const config: ExportConfig = {
		filename: `bills-${new Date().toISOString().split('T')[0]}`,
		columns: [
			{ key: 'billNumber', header: 'Bill Number' },
			{ key: 'vendorInvoiceNumber', header: 'Vendor Invoice #' },
			{
				key: 'vendor',
				header: 'Vendor',
				formatter: (vendor) => vendor?.name || '',
			},
			{
				key: 'billDate',
				header: 'Bill Date',
				formatter: (date) =>
					date ? new Date(date).toLocaleDateString() : '',
			},
			{
				key: 'dueDate',
				header: 'Due Date',
				formatter: (date) =>
					date ? new Date(date).toLocaleDateString() : '',
			},
			{ key: 'status', header: 'Status' },
			{ key: 'currency', header: 'Currency' },
			{
				key: 'totalAmount',
				header: 'Total Amount',
				formatter: (val) => Number(val).toFixed(2),
			},
			{
				key: 'paidAmount',
				header: 'Paid Amount',
				formatter: (val) => Number(val || 0).toFixed(2),
			},
			{
				key: 'balanceDue',
				header: 'Balance Due',
				formatter: (val) => Number(val || 0).toFixed(2),
			},
		],
	};

	const csvContent = arrayToCsv(bills, config);
	downloadCsv(csvContent, config.filename);
}

/**
 * Export estimates to CSV
 */
export function exportEstimatesToCsv(estimates: any[]): void {
	const config: ExportConfig = {
		filename: `estimates-${new Date().toISOString().split('T')[0]}`,
		columns: [
			{ key: 'estimateNumber', header: 'Estimate Number' },
			{
				key: 'client',
				header: 'Client',
				formatter: (client) => client?.name || '',
			},
			{
				key: 'estimateDate',
				header: 'Estimate Date',
				formatter: (date) =>
					date ? new Date(date).toLocaleDateString() : '',
			},
			{
				key: 'expiryDate',
				header: 'Expiry Date',
				formatter: (date) =>
					date ? new Date(date).toLocaleDateString() : '',
			},
			{ key: 'status', header: 'Status' },
			{ key: 'currency', header: 'Currency' },
			{
				key: 'totalAmount',
				header: 'Total Amount',
				formatter: (val) => Number(val).toFixed(2),
			},
			{
				key: 'convertedToInvoice',
				header: 'Converted',
				formatter: (val) => (val ? 'Yes' : 'No'),
			},
		],
	};

	const csvContent = arrayToCsv(estimates, config);
	downloadCsv(csvContent, config.filename);
}

/**
 * Export clients to CSV
 */
export function exportClientsToCsv(clients: any[]): void {
	const config: ExportConfig = {
		filename: `clients-${new Date().toISOString().split('T')[0]}`,
		columns: [
			{ key: 'name', header: 'Name' },
			{ key: 'email', header: 'Email' },
			{ key: 'phone', header: 'Phone' },
			{ key: 'clientType', header: 'Type' },
			{ key: 'billingAddress', header: 'Address' },
			{ key: 'city', header: 'City' },
			{ key: 'state', header: 'State' },
			{ key: 'country', header: 'Country' },
			{ key: 'gstNumber', header: 'GST Number' },
			{ key: 'panNumber', header: 'PAN Number' },
		],
	};

	const csvContent = arrayToCsv(clients, config);
	downloadCsv(csvContent, config.filename);
}

/**
 * Export revenue report to CSV
 */
export function exportRevenueReportToCsv(data: any[]): void {
	const config: ExportConfig = {
		filename: `revenue-report-${new Date().toISOString().split('T')[0]}`,
		columns: [
			{ key: 'month', header: 'Month' },
			{
				key: 'invoiced',
				header: 'Invoiced',
				formatter: (val) => Number(val).toFixed(2),
			},
			{
				key: 'received',
				header: 'Received',
				formatter: (val) => Number(val).toFixed(2),
			},
		],
	};

	const csvContent = arrayToCsv(data, config);
	downloadCsv(csvContent, config.filename);
}
