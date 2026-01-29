/**
 * Invoice PDF Generator Utility
 * Uses browser print functionality for PDF generation
 */

interface InvoiceData {
	invoiceNumber: string;
	invoiceDate: string;
	dueDate?: string;
	invoiceType: string;
	currency: string;
	client?: {
		name: string;
		email?: string;
		billingAddress?: string;
		city?: string;
		state?: string;
		country?: string;
		gstNumber?: string;
	};
	lineItems: {
		description: string;
		quantity: number;
		rate: number;
		taxRate: number;
		totalAmount: number;
		sacCode?: string;
	}[];
	subtotal: number;
	taxAmount: number;
	discountAmount?: number;
	totalAmount: number;
	paidAmount?: number;
	balanceDue?: number;
	notes?: string;
	footerNotes?: string;
	companyName?: string;
	companyAddress?: string;
	companyGst?: string;
}

export function generateInvoicePrintContent(invoice: InvoiceData): string {
	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		});
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-IN', {
			style: 'currency',
			currency: invoice.currency || 'INR',
			minimumFractionDigits: 2,
		}).format(amount);
	};

	return `
		<!DOCTYPE html>
		<html>
		<head>
			<title>${invoice.invoiceNumber}</title>
			<style>
				* { margin: 0; padding: 0; box-sizing: border-box; }
				body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; line-height: 1.5; color: #333; }
				.invoice { max-width: 800px; margin: 0 auto; padding: 40px; }
				.header { display: flex; justify-content: space-between; margin-bottom: 40px; }
				.header-left h1 { font-size: 24px; margin-bottom: 5px; color: #1a1a1a; }
				.header-left p { color: #666; }
				.header-right { text-align: right; }
				.header-right .label { font-size: 10px; color: #666; margin-bottom: 2px; }
				.header-right .value { font-weight: 600; margin-bottom: 10px; }
				.divider { border-top: 1px solid #e0e0e0; margin: 20px 0; }
				.client-section { margin-bottom: 30px; }
				.client-section .label { font-size: 10px; color: #666; margin-bottom: 5px; }
				.client-section .name { font-size: 16px; font-weight: 600; margin-bottom: 5px; }
				.client-section .details { color: #666; }
				table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
				thead { background-color: #f5f5f5; }
				th { padding: 10px; text-align: left; font-size: 10px; text-transform: uppercase; color: #666; border-bottom: 1px solid #e0e0e0; }
				td { padding: 10px; border-bottom: 1px solid #f0f0f0; }
				.text-right { text-align: right; }
				.totals { display: flex; justify-content: flex-end; }
				.totals-table { width: 280px; }
				.totals-table .row { display: flex; justify-content: space-between; padding: 5px 0; }
				.totals-table .row.total { border-top: 2px solid #333; padding-top: 10px; margin-top: 5px; font-weight: bold; font-size: 14px; }
				.totals-table .row.discount { color: #22c55e; }
				.totals-table .row.paid { color: #22c55e; }
				.notes { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
				.notes .label { font-size: 10px; color: #666; margin-bottom: 5px; }
				.notes p { color: #666; white-space: pre-wrap; }
				@media print {
					body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
					.invoice { padding: 20px; }
				}
			</style>
		</head>
		<body>
			<div class="invoice">
				<div class="header">
					<div class="header-left">
						<h1>${invoice.invoiceType === 'export' ? 'EXPORT INVOICE' : 'TAX INVOICE'}</h1>
						<p>${invoice.invoiceNumber}</p>
					</div>
					<div class="header-right">
						<div class="label">Invoice Date</div>
						<div class="value">${formatDate(invoice.invoiceDate)}</div>
						${
							invoice.dueDate
								? `
						<div class="label">Due Date</div>
						<div class="value">${formatDate(invoice.dueDate)}</div>
						`
								: ''
						}
					</div>
				</div>

				<div class="divider"></div>

				<div class="client-section">
					<div class="label">BILL TO</div>
					${
						invoice.client
							? `
					<div class="name">${invoice.client.name}</div>
					<div class="details">
						${invoice.client.billingAddress ? `<div>${invoice.client.billingAddress}</div>` : ''}
						${invoice.client.city || invoice.client.state ? `<div>${[invoice.client.city, invoice.client.state].filter(Boolean).join(', ')}</div>` : ''}
						${invoice.client.gstNumber ? `<div>GSTIN: ${invoice.client.gstNumber}</div>` : ''}
					</div>
					`
							: '<div class="details" style="color: #999;">No client selected</div>'
					}
				</div>

				<table>
					<thead>
						<tr>
							<th style="width: 40%;">Description</th>
							<th>SAC Code</th>
							<th class="text-right">Qty</th>
							<th class="text-right">Rate</th>
							<th class="text-right">Tax</th>
							<th class="text-right">Amount</th>
						</tr>
					</thead>
					<tbody>
						${invoice.lineItems
							.map(
								(item) => `
						<tr>
							<td>${item.description}</td>
							<td>${item.sacCode || '-'}</td>
							<td class="text-right">${item.quantity}</td>
							<td class="text-right">${formatCurrency(item.rate)}</td>
							<td class="text-right">${item.taxRate}%</td>
							<td class="text-right">${formatCurrency(item.totalAmount)}</td>
						</tr>
						`
							)
							.join('')}
					</tbody>
				</table>

				<div class="totals">
					<div class="totals-table">
						<div class="row">
							<span>Subtotal</span>
							<span>${formatCurrency(invoice.subtotal)}</span>
						</div>
						${
							invoice.discountAmount && invoice.discountAmount > 0
								? `
						<div class="row discount">
							<span>Discount</span>
							<span>-${formatCurrency(invoice.discountAmount)}</span>
						</div>
						`
								: ''
						}
						<div class="row">
							<span>Tax</span>
							<span>${formatCurrency(invoice.taxAmount)}</span>
						</div>
						<div class="row total">
							<span>Total</span>
							<span>${formatCurrency(invoice.totalAmount)}</span>
						</div>
						${
							invoice.paidAmount && invoice.paidAmount > 0
								? `
						<div class="row paid">
							<span>Paid</span>
							<span>-${formatCurrency(invoice.paidAmount)}</span>
						</div>
						<div class="row" style="font-weight: bold;">
							<span>Balance Due</span>
							<span>${formatCurrency(invoice.balanceDue || 0)}</span>
						</div>
						`
								: ''
						}
					</div>
				</div>

				${
					invoice.notes
						? `
				<div class="notes">
					<div class="label">NOTES</div>
					<p>${invoice.notes}</p>
				</div>
				`
						: ''
				}
			</div>
		</body>
		</html>
	`;
}

export function printInvoice(invoice: InvoiceData): void {
	const printContent = generateInvoicePrintContent(invoice);
	const printWindow = window.open('', '_blank');
	
	if (printWindow) {
		printWindow.document.write(printContent);
		printWindow.document.close();
		printWindow.onload = () => {
			printWindow.print();
		};
	}
}

export function downloadInvoiceAsPdf(invoice: InvoiceData): void {
	// For actual PDF download, we would use a library like jsPDF or server-side generation
	// For now, we use the print dialog which allows "Save as PDF"
	printInvoice(invoice);
}
