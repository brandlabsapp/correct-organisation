'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';
import { formatCurrency } from '@/lib/utils';

interface Client {
	id: string;
	name: string;
	email: string;
}

interface LineItem {
	id?: string;
	description: string;
	quantity: string;
	unit: string;
	rate: string;
	taxRate: string;
	sacCode: string;
}

const defaultLineItem: LineItem = {
	description: '',
	quantity: '1',
	unit: 'unit',
	rate: '',
	taxRate: '18',
	sacCode: '',
};

export function InvoiceForm({ invoiceId }: { invoiceId?: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [clients, setClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(!!invoiceId);
	const [previewNumber, setPreviewNumber] = useState('');
	const isEditing = !!invoiceId;

	const [formData, setFormData] = useState({
		clientId: '',
		invoiceType: 'domestic',
		title: 'Invoice',
		invoiceDate: new Date().toISOString().split('T')[0],
		dueDate: '',
		paymentTerms: 'net_30',
		currency: 'INR',
		notes: '',
		footerNotes: '',
	});

	const [lineItems, setLineItems] = useState<LineItem[]>([{ ...defaultLineItem }]);

	useEffect(() => {
		if (companyId) {
			fetchClients();
			if (invoiceId) {
				fetchInvoice();
			} else {
				fetchPreviewNumber();
			}
		}
	}, [companyId, invoiceId]);

	useEffect(() => {
		if (!invoiceId && companyId) {
			fetchPreviewNumber();
		}
	}, [formData.invoiceType]);

	const fetchInvoice = async () => {
		try {
			setInitialLoading(true);
			const response = await fetch(
				`/api/finance/invoices/${invoiceId}?company=${companyId}`
			);
			if (response.ok) {
				const invoice = await response.json();
				setFormData({
					clientId: invoice.clientId || '',
					invoiceType: invoice.invoiceType || 'domestic',
					title: invoice.title || 'Invoice',
					invoiceDate: invoice.invoiceDate
						? new Date(invoice.invoiceDate).toISOString().split('T')[0]
						: new Date().toISOString().split('T')[0],
					dueDate: invoice.dueDate
						? new Date(invoice.dueDate).toISOString().split('T')[0]
						: '',
					paymentTerms: invoice.paymentTerms || 'net_30',
					currency: invoice.currency || 'INR',
					notes: invoice.notes || '',
					footerNotes: invoice.footerNotes || '',
				});
				setPreviewNumber(invoice.invoiceNumber);
				if (invoice.lineItems && invoice.lineItems.length > 0) {
					setLineItems(
						invoice.lineItems.map((item: any) => ({
							id: item.id,
							description: item.description || '',
							quantity: String(item.quantity ?? 1),
							unit: item.unit || 'unit',
							rate: String(item.rate ?? 0),
							taxRate: String(item.taxRate ?? 18),
							sacCode: item.sacCode || '',
						}))
					);
				}
			}
		} catch (error) {
			console.error('Error fetching invoice:', error);
			showErrorToast({
				title: 'Error',
				message: 'Failed to load invoice',
			});
		} finally {
			setInitialLoading(false);
		}
	};

	const fetchClients = async () => {
		try {
			const response = await fetch(`/api/finance/clients?company=${companyId}`);
			if (response.ok) {
				const data = await response.json();
				setClients(data.rows || []);
			}
		} catch (error) {
			console.error('Error fetching clients:', error);
		}
	};

	const fetchPreviewNumber = async () => {
		try {
			const type = formData.invoiceType === 'export' ? 'export' : 'domestic';
			const response = await fetch(
				`/api/finance/invoices/preview-number?company=${companyId}&type=${type}`
			);
			if (response.ok) {
				const number = await response.text();
				setPreviewNumber(number.replace(/"/g, ''));
			}
		} catch (error) {
			console.error('Error fetching preview number:', error);
		}
	};

	const parseNumber = (value: string) => {
		const n = Number.parseFloat(value);
		return Number.isFinite(n) ? n : 0;
	};

	const sanitizeNumericInput = (
		raw: string,
		opts?: { allowDecimal?: boolean; maxLength?: number; maxDecimals?: number }
	) => {
		const allowDecimal = opts?.allowDecimal ?? true;
		const maxLength = opts?.maxLength;
		const maxDecimals = opts?.maxDecimals ?? 2;
		let v = raw.replace(/[^\d.]/g, '');
		if (!allowDecimal) v = v.replace(/\./g, '');
		// allow only a single decimal point
		const firstDot = v.indexOf('.');
		if (firstDot !== -1) {
			const intPart = v.slice(0, firstDot);
			const decPart = v.slice(firstDot + 1).replace(/\./g, '').slice(0, maxDecimals);
			v = `${intPart}.${decPart}`;
		}
		// Apply max length for integer part
		if (maxLength) {
			const [intPart, decPart] = v.split('.');
			if (intPart.length > maxLength) {
				v = decPart !== undefined ? `${intPart.slice(0, maxLength)}.${decPart}` : intPart.slice(0, maxLength);
			}
		}
		// remove leading zeros for integer part (keep "0." and single "0")
		const [intPart, decPart] = v.split('.');
		const normalizedInt = intPart.replace(/^0+(?=\d)/, '');
		return decPart === undefined ? normalizedInt : `${normalizedInt || '0'}.${decPart}`;
	};

	const calculateLineTotal = (item: LineItem) => {
		const qty = parseNumber(item.quantity || '0');
		const rate = parseNumber(item.rate || '0');
		const taxRate = parseNumber(item.taxRate || '0');
		const amount = qty * rate;
		const taxAmount = (amount * taxRate) / 100;
		return amount + taxAmount;
	};

	const calculateSubtotal = () => {
		return lineItems.reduce(
			(sum, item) => sum + parseNumber(item.quantity) * parseNumber(item.rate),
			0
		);
	};

	const calculateTaxTotal = () => {
		return lineItems.reduce((sum, item) => {
			const amount = parseNumber(item.quantity) * parseNumber(item.rate);
			return sum + (amount * parseNumber(item.taxRate)) / 100;
		}, 0);
	};

	const calculateTotal = () => {
		return calculateSubtotal() + calculateTaxTotal();
	};

	const addLineItem = () => {
		setLineItems([...lineItems, { ...defaultLineItem }]);
	};

	const removeLineItem = (index: number) => {
		if (lineItems.length > 1) {
			setLineItems(lineItems.filter((_, i) => i !== index));
		}
	};

	const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
		const updated = [...lineItems];
		updated[index] = { ...updated[index], [field]: value };
		setLineItems(updated);
	};

	const handleSubmit = async (saveAsDraft: boolean = false) => {
		try {
			setLoading(true);

			// Validate
			const validLineItems = lineItems
				.map((item) => ({
					...item,
					quantity: parseNumber(item.quantity),
					rate: parseNumber(item.rate),
					taxRate: parseNumber(item.taxRate),
				}))
				.filter((item) => item.description && item.rate > 0);
			if (validLineItems.length === 0) {
				showErrorToast({
					title: 'Validation Error',
					message: 'Please add at least one line item',
				});
				return;
			}

			const payload = {
				...formData,
				lineItems: validLineItems,
				saveAsDraft,
			};

			const url = isEditing
				? `/api/finance/invoices/${invoiceId}?company=${companyId}`
				: `/api/finance/invoices?company=${companyId}`;

			const response = await fetch(url, {
				method: isEditing ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				const invoice = await response.json();
				showSuccessToast({
					title: 'Success',
					message: `Invoice ${invoice.invoiceNumber} ${isEditing ? 'updated' : 'created'} successfully`,
				});
				router.push(`/finance/invoices/${invoice.id}?company=${companyId}`);
			} else {
				const error = await response.json();
				showErrorToast({
					title: 'Error',
					message: error.message || `Failed to ${isEditing ? 'update' : 'create'} invoice`,
				});
			}
		} catch (error) {
			console.error('Error saving invoice:', error);
			showErrorToast({
				title: 'Error',
				message: `Failed to ${isEditing ? 'update' : 'create'} invoice`,
			});
		} finally {
			setLoading(false);
		}
	};

	if (initialLoading) {
		return (
			<div className='p-6 max-w-5xl mx-auto space-y-6'>
				<div className='animate-pulse space-y-6'>
					<div className='h-10 w-64 bg-gray-200 rounded' />
					<div className='h-64 bg-gray-200 rounded-lg' />
					<div className='h-48 bg-gray-200 rounded-lg' />
				</div>
			</div>
		);
	}

	return (
		<div className='p-6 max-w-5xl mx-auto space-y-6'>
			{/* Header */}
			<div className='flex items-center gap-4'>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => router.back()}
				>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>
						{isEditing ? 'Edit Invoice' : 'New Invoice'}
					</h1>
					<p className='text-gray-500'>Invoice # {previewNumber || '...'}</p>
				</div>
			</div>

			{/* Main Form */}
			<Card>
				<CardHeader>
					<CardTitle>Invoice Details</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6 p-6'>
					{/* Invoice Type & Client */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<Label>Invoice Type</Label>
							<Select
								value={formData.invoiceType}
								onValueChange={(value) =>
									setFormData({ ...formData, invoiceType: value })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='domestic'>Domestic (INV)</SelectItem>
									<SelectItem value='export'>Export (EXP)</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<Label>Client</Label>
							<Select
								value={formData.clientId}
								onValueChange={(value) =>
									setFormData({ ...formData, clientId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select client' />
								</SelectTrigger>
								<SelectContent>
									{clients.map((client) => (
										<SelectItem key={client.id} value={client.id}>
											{client.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Dates */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='space-y-2'>
							<Label>Invoice Date</Label>
							<Input
								type='date'
								value={formData.invoiceDate}
								onChange={(e) =>
									setFormData({ ...formData, invoiceDate: e.target.value })
								}
							/>
						</div>

						<div className='space-y-2'>
							<Label>Payment Terms</Label>
							<Select
								value={formData.paymentTerms}
								onValueChange={(value) =>
									setFormData({ ...formData, paymentTerms: value })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='due_on_receipt'>Due on Receipt</SelectItem>
									<SelectItem value='net_7'>Net 7</SelectItem>
									<SelectItem value='net_15'>Net 15</SelectItem>
									<SelectItem value='net_30'>Net 30</SelectItem>
									<SelectItem value='net_45'>Net 45</SelectItem>
									<SelectItem value='net_60'>Net 60</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<Label>Currency</Label>
							<Select
								value={formData.currency}
								onValueChange={(value) =>
									setFormData({ ...formData, currency: value })
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='INR'>INR - Indian Rupee</SelectItem>
									<SelectItem value='USD'>USD - US Dollar</SelectItem>
									<SelectItem value='EUR'>EUR - Euro</SelectItem>
									<SelectItem value='GBP'>GBP - British Pound</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Line Items */}
			<Card>
				<CardHeader>
					<CardTitle>Line Items</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6 p-6'>
					{/* Table Header - Desktop Only */}
					<div className='hidden md:grid grid-cols-[minmax(0,4fr)_minmax(80px,1fr)_minmax(120px,2fr)_minmax(80px,1fr)_minmax(120px,2fr)_minmax(140px,1.5fr)_60px] gap-4 pb-2 border-b'>
						<div className='text-sm font-medium text-gray-600'>Description</div>
						<div className='text-sm font-medium text-gray-600'>Qty</div>
						<div className='text-sm font-medium text-gray-600'>Rate</div>
						<div className='text-sm font-medium text-gray-600'>Tax %</div>
						<div className='text-sm font-medium text-gray-600'>SAC Code</div>
						<div className='text-sm font-medium text-gray-600 text-right'>Total</div>
						<div></div>
					</div>
					{lineItems.map((item, index) => (
						<div
							key={index}
							className='grid grid-cols-1 md:grid-cols-[minmax(0,4fr)_minmax(80px,1fr)_minmax(120px,2fr)_minmax(80px,1fr)_minmax(120px,2fr)_minmax(140px,1.5fr)_60px] gap-4 items-end border-b pb-6 last:border-b-0'
						>
							<div className='space-y-2'>
								<Label>Description</Label>
								<Textarea
									value={item.description}
									onChange={(e) =>
										updateLineItem(index, 'description', e.target.value)
									}
									placeholder='Item description'
									rows={2}
								/>
							</div>
							<div className='space-y-2'>
								<Label className='md:hidden'>Qty</Label>
								<Input
									type='text'
									inputMode='numeric'
									pattern='[0-9]*'
									value={item.quantity}
									maxLength={10}
									onChange={(e) =>
										updateLineItem(
											index,
											'quantity',
											sanitizeNumericInput(e.target.value, {
												allowDecimal: false,
												maxLength: 10,
											})
										)
									}
									onBlur={() => {
										const normalized = sanitizeNumericInput(item.quantity || '0', {
											allowDecimal: false,
										});
										updateLineItem(index, 'quantity', normalized || '0');
									}}
									className='text-right'
								/>
							</div>
							<div className='space-y-2'>
								<Label className='md:hidden'>Rate</Label>
								<Input
									type='text'
									inputMode='decimal'
									value={item.rate}
									placeholder='0.00'
									maxLength={15}
									onChange={(e) => {
										const sanitized = sanitizeNumericInput(e.target.value, {
											maxLength: 12,
											maxDecimals: 2,
										});
										updateLineItem(index, 'rate', sanitized);
									}}
									onBlur={() => {
										if (item.rate && item.rate.trim() !== '') {
											const normalized = sanitizeNumericInput(item.rate, {
												maxDecimals: 2,
											});
											updateLineItem(index, 'rate', normalized || '');
										}
									}}
									onFocus={(e) => {
										if (e.target.value === '0' || e.target.value === '') {
											e.target.select();
										}
									}}
									className='text-right'
								/>
							</div>
							<div className='space-y-2'>
								<Label className='md:hidden'>Tax %</Label>
								<Input
									type='text'
									inputMode='decimal'
									value={item.taxRate}
									maxLength={6}
									onChange={(e) =>
										updateLineItem(
											index,
											'taxRate',
											sanitizeNumericInput(e.target.value, {
												allowDecimal: true,
												maxLength: 5,
												maxDecimals: 2,
											})
										)
									}
									onBlur={() => {
										const normalized = sanitizeNumericInput(item.taxRate || '0', {
											allowDecimal: true,
											maxDecimals: 2,
										});
										updateLineItem(index, 'taxRate', normalized || '0');
									}}
									className='text-right'
								/>
							</div>
							<div className='space-y-2'>
								<Label className='md:hidden'>SAC Code</Label>
								<Input
									value={item.sacCode}
									maxLength={10}
									onChange={(e) =>
										updateLineItem(index, 'sacCode', e.target.value)
									}
									placeholder='998314'
								/>
							</div>
							<div className='space-y-2'>
								<Label className='md:hidden'>Total</Label>
								<div className='h-10 flex items-center justify-end font-medium tabular-nums text-sm px-3 border border-secondarygray rounded-md bg-gray-50'>
									<span className='truncate'>
										{formatCurrency(calculateLineTotal(item), formData.currency)}
									</span>
								</div>
							</div>
							<div className='flex justify-end items-end pb-0.5'>
								<Button
									variant='ghost'
									size='icon'
									onClick={() => removeLineItem(index)}
									disabled={lineItems.length === 1}
									className='shrink-0'
								>
									<Trash2 className='h-4 w-4 text-red-500' />
								</Button>
							</div>
						</div>
					))}

					<div className='pt-2'>
						<Button variant='outline' onClick={addLineItem}>
							<Plus className='h-4 w-4 mr-2' />
							Add Line Item
						</Button>
					</div>

					{/* Totals */}
					<div className='flex justify-end pt-4 border-t'>
						<div className='w-full md:w-80 space-y-3'>
							<div className='flex justify-between text-sm'>
								<span className='text-gray-600'>Subtotal:</span>
								<span className='font-medium tabular-nums'>
									{formatCurrency(calculateSubtotal(), formData.currency)}
								</span>
							</div>
							<div className='flex justify-between text-sm'>
								<span className='text-gray-600'>Tax:</span>
								<span className='font-medium tabular-nums'>
									{formatCurrency(calculateTaxTotal(), formData.currency)}
								</span>
							</div>
							<div className='flex justify-between text-lg font-bold border-t pt-3'>
								<span>Total:</span>
								<span className='tabular-nums'>
									{formatCurrency(calculateTotal(), formData.currency)}
								</span>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Notes */}
			<Card>
				<CardHeader>
					<CardTitle>Notes</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6 p-6'>
					<div className='space-y-2'>
						<Label>Invoice Notes (visible to client)</Label>
						<Textarea
							value={formData.notes}
							onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
							placeholder='Bank details, payment instructions, etc.'
							rows={3}
						/>
					</div>
					<div className='space-y-2'>
						<Label>Footer Notes</Label>
						<Textarea
							value={formData.footerNotes}
							onChange={(e) =>
								setFormData({ ...formData, footerNotes: e.target.value })
							}
							placeholder='Terms and conditions'
							rows={2}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Actions */}
			<div className='flex justify-end gap-4'>
				<Button variant='outline' onClick={() => router.back()}>
					Cancel
				</Button>
				{!isEditing && (
					<Button
						variant='outline'
						onClick={() => handleSubmit(true)}
						disabled={loading}
					>
						<Save className='h-4 w-4 mr-2' />
						Save as Draft
					</Button>
				)}
				<Button
					className='bg-green hover:bg-green/90'
					onClick={() => handleSubmit(false)}
					disabled={loading}
				>
					{loading
						? isEditing
							? 'Updating...'
							: 'Creating...'
						: isEditing
							? 'Update Invoice'
							: 'Create Invoice'}
				</Button>
			</div>
		</div>
	);
}
