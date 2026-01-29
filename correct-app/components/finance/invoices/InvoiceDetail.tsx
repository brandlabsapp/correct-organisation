'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	ArrowLeft,
	Edit,
	Send,
	CheckCircle,
	Copy,
	Trash2,
	MoreVertical,
	Download,
	Mail,
	Clock,
	DollarSign,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';
import { printInvoice } from '@/lib/utils/pdf-generator';

interface Invoice {
	id: string;
	invoiceNumber: string;
	invoiceType: string;
	invoiceDate: string;
	dueDate: string;
	status: string;
	totalAmount: number;
	subtotal: number;
	taxAmount: number;
	discountAmount: number;
	paidAmount: number;
	balanceDue: number;
	currency: string;
	notes: string;
	footerNotes: string;
	client?: {
		id: string;
		name: string;
		email: string;
		phone: string;
		billingAddress: string;
		city: string;
		state: string;
		country: string;
		gstNumber: string;
	};
	lineItems?: {
		id: string;
		description: string;
		quantity: number;
		rate: number;
		taxRate: number;
		amount: number;
		taxAmount: number;
		totalAmount: number;
		sacCode: string;
	}[];
	payments?: {
		id: string;
		amount: number;
		paymentDate: string;
		paymentMethod: string;
		referenceNumber: string;
	}[];
}

const statusColors: Record<string, string> = {
	draft: 'bg-gray-100 text-gray-800',
	sent: 'bg-blue-100 text-blue-800',
	viewed: 'bg-purple-100 text-purple-800',
	paid: 'bg-green-100 text-green-800',
	partially_paid: 'bg-yellow-100 text-yellow-800',
	overdue: 'bg-red-100 text-red-800',
	cancelled: 'bg-gray-100 text-gray-500',
};

export function InvoiceDetail({ invoiceId }: { invoiceId: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [invoice, setInvoice] = useState<Invoice | null>(null);
	const [loading, setLoading] = useState(true);
	const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
	const [paymentData, setPaymentData] = useState({
		amount: 0,
		paymentDate: new Date().toISOString().split('T')[0],
		paymentMethod: 'bank_transfer',
		referenceNumber: '',
	});

	useEffect(() => {
		if (companyId && invoiceId) {
			fetchInvoice();
		}
	}, [companyId, invoiceId]);

	const fetchInvoice = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`/api/finance/invoices/${invoiceId}?company=${companyId}`
			);
			if (response.ok) {
				const data = await response.json();
				setInvoice(data);
				setPaymentData((prev) => ({
					...prev,
					amount: data.balanceDue || 0,
				}));
			}
		} catch (error) {
			console.error('Error fetching invoice:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsSent = async () => {
		try {
			const response = await fetch(
				`/api/finance/invoices/${invoiceId}/mark-sent?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Invoice marked as sent' });
				fetchInvoice();
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to update invoice' });
		}
	};

	const handleMarkAsPaid = async () => {
		try {
			const response = await fetch(
				`/api/finance/invoices/${invoiceId}/mark-paid?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Invoice marked as paid' });
				fetchInvoice();
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to update invoice' });
		}
	};

	const handleRecordPayment = async () => {
		try {
			const response = await fetch(
				`/api/finance/invoices/${invoiceId}/payments?company=${companyId}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(paymentData),
				}
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Payment recorded' });
				setPaymentDialogOpen(false);
				fetchInvoice();
			} else {
				const error = await response.json();
				showErrorToast({
					title: 'Error',
					message: error.message || 'Failed to record payment',
				});
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to record payment' });
		}
	};

	const handleDuplicate = async () => {
		try {
			const response = await fetch(
				`/api/finance/invoices/${invoiceId}/duplicate?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				const newInvoice = await response.json();
				showSuccessToast({ title: 'Success', message: 'Invoice duplicated' });
				router.push(`/finance/invoices/${newInvoice.id}?company=${companyId}`);
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to duplicate invoice' });
		}
	};

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this invoice?')) return;
		try {
			const response = await fetch(
				`/api/finance/invoices/${invoiceId}?company=${companyId}`,
				{ method: 'DELETE' }
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Invoice deleted' });
				router.push(`/finance/invoices?company=${companyId}`);
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to delete invoice' });
		}
	};

	if (loading) {
		return (
			<div className='p-6 animate-pulse space-y-6'>
				<div className='h-8 w-64 bg-gray-200 rounded' />
				<div className='h-64 bg-gray-200 rounded-lg' />
				<div className='h-48 bg-gray-200 rounded-lg' />
			</div>
		);
	}

	if (!invoice) {
		return (
			<div className='p-6 text-center'>
				<p className='text-gray-500'>Invoice not found</p>
				<Button
					variant='link'
					onClick={() => router.push(`/finance/invoices?company=${companyId}`)}
				>
					Go back to invoices
				</Button>
			</div>
		);
	}

	return (
		<div className='p-6 max-w-5xl mx-auto space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start gap-4'>
				<div className='flex items-center gap-4'>
					<Button variant='ghost' size='icon' onClick={() => router.back()}>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<div className='flex items-center gap-3'>
							<h1 className='text-2xl font-bold'>{invoice.invoiceNumber}</h1>
							<Badge className={statusColors[invoice.status]}>
								{invoice.status.replace('_', ' ')}
							</Badge>
						</div>
						<p className='text-gray-500'>
							{invoice.invoiceType === 'export' ? 'Export Invoice' : 'Tax Invoice'}
						</p>
					</div>
				</div>

				<div className='flex gap-2'>
					{invoice.status === 'draft' && (
						<Button variant='outline' onClick={handleMarkAsSent}>
							<Send className='h-4 w-4 mr-2' />
							Mark as Sent
						</Button>
					)}
					{invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
						<Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
							<DialogTrigger asChild>
								<Button className='bg-green hover:bg-green/90'>
									<DollarSign className='h-4 w-4 mr-2' />
									Record Payment
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Record Payment</DialogTitle>
								</DialogHeader>
								<div className='space-y-4 py-4'>
									<div className='space-y-2'>
										<Label>Amount</Label>
										<Input
											type='number'
											value={paymentData.amount}
											onChange={(e) =>
												setPaymentData({
													...paymentData,
													amount: parseFloat(e.target.value) || 0,
												})
											}
										/>
										<p className='text-sm text-gray-500'>
											Balance due: {formatCurrency(invoice.balanceDue, invoice.currency)}
										</p>
									</div>
									<div className='space-y-2'>
										<Label>Payment Date</Label>
										<Input
											type='date'
											value={paymentData.paymentDate}
											onChange={(e) =>
												setPaymentData({
													...paymentData,
													paymentDate: e.target.value,
												})
											}
										/>
									</div>
									<div className='space-y-2'>
										<Label>Payment Method</Label>
										<Select
											value={paymentData.paymentMethod}
											onValueChange={(value) =>
												setPaymentData({ ...paymentData, paymentMethod: value })
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value='bank_transfer'>Bank Transfer</SelectItem>
												<SelectItem value='cash'>Cash</SelectItem>
												<SelectItem value='cheque'>Cheque</SelectItem>
												<SelectItem value='upi'>UPI</SelectItem>
												<SelectItem value='card'>Card</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className='space-y-2'>
										<Label>Reference Number</Label>
										<Input
											value={paymentData.referenceNumber}
											onChange={(e) =>
												setPaymentData({
													...paymentData,
													referenceNumber: e.target.value,
												})
											}
											placeholder='Transaction ID or cheque number'
										/>
									</div>
									<div className='flex justify-end gap-2 pt-4'>
										<Button
											variant='outline'
											onClick={() => setPaymentDialogOpen(false)}
										>
											Cancel
										</Button>
										<Button
											className='bg-green hover:bg-green/90'
											onClick={handleRecordPayment}
										>
											Record Payment
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' size='icon'>
								<MoreVertical className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem
								onClick={() =>
									router.push(
										`/finance/invoices/${invoiceId}/edit?company=${companyId}`
									)
								}
							>
								<Edit className='h-4 w-4 mr-2' />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem onClick={handleDuplicate}>
								<Copy className='h-4 w-4 mr-2' />
								Duplicate
							</DropdownMenuItem>
							{invoice.status !== 'paid' && (
								<DropdownMenuItem onClick={handleMarkAsPaid}>
									<CheckCircle className='h-4 w-4 mr-2' />
									Mark as Paid
								</DropdownMenuItem>
							)}
							<DropdownMenuItem onClick={() => invoice && printInvoice(invoice as any)}>
								<Download className='h-4 w-4 mr-2' />
								Download PDF
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Mail className='h-4 w-4 mr-2' />
								Send Email
							</DropdownMenuItem>
							{invoice.status !== 'paid' && (
								<DropdownMenuItem onClick={handleDelete} className='text-red-600'>
									<Trash2 className='h-4 w-4 mr-2' />
									Delete
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Invoice Preview Card */}
			<Card>
				<CardContent className='p-8'>
					{/* Header Section */}
					<div className='flex justify-between mb-8'>
						<div>
							<h2 className='text-xl font-bold mb-1'>
								{invoice.invoiceType === 'export' ? 'EXPORT INVOICE' : 'TAX INVOICE'}
							</h2>
							<p className='text-gray-600'>{invoice.invoiceNumber}</p>
						</div>
						<div className='text-right'>
							<div className='text-sm text-gray-500'>Invoice Date</div>
							<div className='font-medium'>
								{new Date(invoice.invoiceDate).toLocaleDateString('en-IN', {
									day: '2-digit',
									month: 'short',
									year: 'numeric',
								})}
							</div>
							{invoice.dueDate && (
								<>
									<div className='text-sm text-gray-500 mt-2'>Due Date</div>
									<div className='font-medium'>
										{new Date(invoice.dueDate).toLocaleDateString('en-IN', {
											day: '2-digit',
											month: 'short',
											year: 'numeric',
										})}
									</div>
								</>
							)}
						</div>
					</div>

					<Separator className='my-6' />

					{/* Bill To */}
					<div className='mb-8'>
						<div className='text-sm text-gray-500 mb-2'>Bill To</div>
						{invoice.client ? (
							<div>
								<div className='font-semibold text-lg'>{invoice.client.name}</div>
								{invoice.client.billingAddress && (
									<div className='text-gray-600'>{invoice.client.billingAddress}</div>
								)}
								{(invoice.client.city || invoice.client.state) && (
									<div className='text-gray-600'>
										{[invoice.client.city, invoice.client.state]
											.filter(Boolean)
											.join(', ')}
									</div>
								)}
								{invoice.client.gstNumber && (
									<div className='text-gray-600'>
										GSTIN: {invoice.client.gstNumber}
									</div>
								)}
							</div>
						) : (
							<div className='text-gray-400 italic'>No client selected</div>
						)}
					</div>

					{/* Line Items */}
					<Table>
						<TableHeader>
							<TableRow className='bg-gray-50'>
								<TableHead className='w-[40%]'>Description</TableHead>
								<TableHead>SAC Code</TableHead>
								<TableHead className='text-right'>Qty</TableHead>
								<TableHead className='text-right'>Rate</TableHead>
								<TableHead className='text-right'>Tax</TableHead>
								<TableHead className='text-right'>Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{invoice.lineItems && invoice.lineItems.length > 0 ? (
								invoice.lineItems.map((item, index) => (
									<TableRow key={item.id || index}>
										<TableCell>{item.description}</TableCell>
										<TableCell>{item.sacCode || '-'}</TableCell>
										<TableCell className='text-right'>{item.quantity}</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(item.rate, invoice.currency)}
										</TableCell>
										<TableCell className='text-right'>{item.taxRate}%</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(item.totalAmount, invoice.currency)}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={6} className='text-center text-gray-400'>
										No line items
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					{/* Totals */}
					<div className='flex justify-end mt-6'>
						<div className='w-72 space-y-2'>
							<div className='flex justify-between'>
								<span className='text-gray-600'>Subtotal</span>
								<span>{formatCurrency(invoice.subtotal, invoice.currency)}</span>
							</div>
							{invoice.discountAmount > 0 && (
								<div className='flex justify-between text-green-600'>
									<span>Discount</span>
									<span>
										-{formatCurrency(invoice.discountAmount, invoice.currency)}
									</span>
								</div>
							)}
							<div className='flex justify-between'>
								<span className='text-gray-600'>Tax</span>
								<span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
							</div>
							<Separator />
							<div className='flex justify-between text-lg font-bold'>
								<span>Total</span>
								<span>{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
							</div>
							{invoice.paidAmount > 0 && (
								<>
									<div className='flex justify-between text-green-600'>
										<span>Paid</span>
										<span>
											-{formatCurrency(invoice.paidAmount, invoice.currency)}
										</span>
									</div>
									<div className='flex justify-between font-bold'>
										<span>Balance Due</span>
										<span>
											{formatCurrency(invoice.balanceDue, invoice.currency)}
										</span>
									</div>
								</>
							)}
						</div>
					</div>

					{/* Notes */}
					{invoice.notes && (
						<div className='mt-8 pt-6 border-t'>
							<div className='text-sm text-gray-500 mb-2'>Notes</div>
							<p className='text-gray-700 whitespace-pre-wrap'>{invoice.notes}</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Payment History */}
			{invoice.payments && invoice.payments.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Clock className='h-5 w-5' />
							Payment History
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Method</TableHead>
									<TableHead>Reference</TableHead>
									<TableHead className='text-right'>Amount</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoice.payments.map((payment) => (
									<TableRow key={payment.id}>
										<TableCell>
											{new Date(payment.paymentDate).toLocaleDateString()}
										</TableCell>
										<TableCell className='capitalize'>
											{payment.paymentMethod.replace('_', ' ')}
										</TableCell>
										<TableCell>{payment.referenceNumber || '-'}</TableCell>
										<TableCell className='text-right font-medium'>
											{formatCurrency(payment.amount, invoice.currency)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
