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
import { Plus, Trash2, ArrowLeft, Save, Upload } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';
import { formatCurrency } from '@/lib/utils';

interface Client {
	id: string;
	name: string;
	email: string;
}

interface LineItem {
	description: string;
	quantity: string;
	unit: string;
	rate: string;
	taxRate: string;
	sacCode: string;
	hsnCode: string;
}

const defaultLineItem: LineItem = {
	description: '',
	quantity: '1',
	unit: 'unit',
	rate: '',
	taxRate: '18',
	sacCode: '',
	hsnCode: '',
};

export function BillForm({ billId }: { billId?: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [vendors, setVendors] = useState<Client[]>([]);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(!!billId);
	const [previewNumber, setPreviewNumber] = useState('');
	const isEditing = !!billId;

	const [formData, setFormData] = useState({
		vendorId: '',
		title: '',
		vendorInvoiceNumber: '',
		billDate: new Date().toISOString().split('T')[0],
		dueDate: '',
		currency: 'INR',
		notes: '',
	});

	const [lineItems, setLineItems] = useState<LineItem[]>([{ ...defaultLineItem }]);

	useEffect(() => {
		if (companyId) {
			fetchVendors();
			if (billId) {
				fetchBill();
			} else {
				fetchPreviewNumber();
			}
		}
	}, [companyId, billId]);

	const fetchBill = async () => {
		try {
			setInitialLoading(true);
			const response = await fetch(
				`/api/finance/bills/${billId}?company=${companyId}`
			);
			if (response.ok) {
				const bill = await response.json();
				setFormData({
					vendorId: bill.vendorId || '',
					title: bill.title || '',
					vendorInvoiceNumber: bill.vendorInvoiceNumber || '',
					billDate: bill.billDate
						? new Date(bill.billDate).toISOString().split('T')[0]
						: new Date().toISOString().split('T')[0],
					dueDate: bill.dueDate
						? new Date(bill.dueDate).toISOString().split('T')[0]
						: '',
					currency: bill.currency || 'INR',
					notes: bill.notes || '',
				});
				setPreviewNumber(bill.billNumber);
				if (bill.lineItems && bill.lineItems.length > 0) {
					setLineItems(
						bill.lineItems.map((item: any) => ({
							description: item.description || '',
							quantity: String(item.quantity ?? 1),
							unit: item.unit || 'unit',
							rate: String(item.rate ?? 0),
							taxRate: String(item.taxRate ?? 18),
							sacCode: item.sacCode || '',
							hsnCode: item.hsnCode || '',
						}))
					);
				}
			}
		} catch (error) {
			console.error('Error fetching bill:', error);
		} finally {
			setInitialLoading(false);
		}
	};

	const fetchVendors = async () => {
		try {
			const response = await fetch(
				`/api/finance/clients?company=${companyId}&clientType=vendor`
			);
			if (response.ok) {
				const data = await response.json();
				setVendors(data.rows || []);
			}
		} catch (error) {
			console.error('Error fetching vendors:', error);
		}
	};

	const fetchPreviewNumber = async () => {
		try {
			const response = await fetch(
				`/api/finance/bills/preview-number?company=${companyId}`
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
		const firstDot = v.indexOf('.');
		if (firstDot !== -1) {
			const intPart = v.slice(0, firstDot);
			const decPart = v.slice(firstDot + 1).replace(/\./g, '').slice(0, maxDecimals);
			v = `${intPart}.${decPart}`;
		}
		if (maxLength) {
			const [intPart, decPart] = v.split('.');
			if (intPart.length > maxLength) {
				v = decPart !== undefined ? `${intPart.slice(0, maxLength)}.${decPart}` : intPart.slice(0, maxLength);
			}
		}
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
			(sum, item) => sum + parseNumber(item.quantity || '0') * parseNumber(item.rate || '0'),
			0
		);
	};

	const calculateTaxTotal = () => {
		return lineItems.reduce((sum, item) => {
			const amount = parseNumber(item.quantity || '0') * parseNumber(item.rate || '0');
			return sum + (amount * parseNumber(item.taxRate || '0')) / 100;
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
				? `/api/finance/bills/${billId}?company=${companyId}`
				: `/api/finance/bills?company=${companyId}`;

			const response = await fetch(url, {
				method: isEditing ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				const bill = await response.json();
				showSuccessToast({
					title: 'Success',
					message: `Bill ${bill.billNumber} ${isEditing ? 'updated' : 'created'} successfully`,
				});
				router.push(`/finance/bills/${bill.id}?company=${companyId}`);
			} else {
				const error = await response.json();
				showErrorToast({
					title: 'Error',
					message: error.message || `Failed to ${isEditing ? 'update' : 'create'} bill`,
				});
			}
		} catch (error) {
			console.error('Error saving bill:', error);
			showErrorToast({
				title: 'Error',
				message: `Failed to ${isEditing ? 'update' : 'create'} bill`,
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
				<Button variant='ghost' size='icon' onClick={() => router.back()}>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>
						{isEditing ? 'Edit Bill' : 'New Bill'}
					</h1>
					<p className='text-gray-500'>Bill # {previewNumber || '...'}</p>
				</div>
			</div>

			{/* Main Form */}
			<Card>
				<CardHeader>
					<CardTitle>Bill Details</CardTitle>
				</CardHeader>
				<CardContent className='space-y-6 p-6'>
					{/* Vendor & Invoice Number */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<Label>Vendor</Label>
							<Select
								value={formData.vendorId}
								onValueChange={(value) =>
									setFormData({ ...formData, vendorId: value })
								}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select vendor' />
								</SelectTrigger>
								<SelectContent>
									{vendors.length === 0 ? (
										<SelectItem value='none' disabled>
											No vendors found
										</SelectItem>
									) : (
										vendors.map((vendor) => (
											<SelectItem key={vendor.id} value={vendor.id}>
												{vendor.name}
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-2'>
							<Label>Vendor Invoice Number</Label>
							<Input
								value={formData.vendorInvoiceNumber}
								onChange={(e) =>
									setFormData({ ...formData, vendorInvoiceNumber: e.target.value })
								}
								placeholder='Vendor invoice reference'
							/>
						</div>
					</div>

					{/* Dates & Currency */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='space-y-2'>
							<Label>Bill Date</Label>
							<Input
								type='date'
								value={formData.billDate}
								onChange={(e) =>
									setFormData({ ...formData, billDate: e.target.value })
								}
							/>
						</div>

						<div className='space-y-2'>
							<Label>Due Date</Label>
							<Input
								type='date'
								value={formData.dueDate}
								onChange={(e) =>
									setFormData({ ...formData, dueDate: e.target.value })
								}
							/>
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
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Attachment */}
					<div className='space-y-2'>
						<Label>Attachment</Label>
						<div className='border-2 border-dashed rounded-lg p-6 text-center'>
							<Upload className='h-8 w-8 mx-auto text-gray-400 mb-2' />
							<p className='text-sm text-gray-500'>
								Drag and drop or click to upload invoice/receipt
							</p>
							<Input type='file' className='hidden' id='attachment' />
							<Button
								variant='outline'
								size='sm'
								className='mt-2'
								onClick={() => document.getElementById('attachment')?.click()}
							>
								Choose File
							</Button>
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
						<div className='text-sm font-medium text-gray-600'>SAC/HSN</div>
						<div className='text-sm font-medium text-gray-600 text-right'>Total</div>
						<div></div>
					</div>
					{lineItems.map((item, index) => (
						<div
							key={index}
							className='grid grid-cols-1 md:grid-cols-[minmax(0,4fr)_minmax(80px,1fr)_minmax(120px,2fr)_minmax(80px,1fr)_minmax(120px,2fr)_minmax(140px,1.5fr)_60px] gap-4 items-end border-b pb-6 last:border-b-0'
						>
							<div className='space-y-2'>
								<Label className='md:hidden'>Description</Label>
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
											sanitizeNumericInput(e.target.value, { allowDecimal: false, maxLength: 10 })
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
								<Label className='md:hidden'>SAC/HSN</Label>
								<Input
									value={item.sacCode || item.hsnCode}
									maxLength={10}
									onChange={(e) =>
										updateLineItem(index, 'sacCode', e.target.value)
									}
									placeholder='Code'
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
						<Label>Notes</Label>
						<Textarea
							value={formData.notes}
							onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
							placeholder='Internal notes about this bill'
							rows={3}
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
							? 'Update Bill'
							: 'Create Bill'}
				</Button>
			</div>
		</div>
	);
}
