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
	Trash2,
	MoreVertical,
	Download,
	Clock,
	DollarSign,
	CheckCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';

interface Bill {
	id: string;
	billNumber: string;
	billDate: string;
	dueDate: string;
	status: string;
	totalAmount: number;
	subtotal: number;
	taxAmount: number;
	paidAmount: number;
	balanceDue: number;
	currency: string;
	notes: string;
	vendorInvoiceNumber: string;
	vendor?: {
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
		hsnCode: string;
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
	unpaid: 'bg-yellow-100 text-yellow-800',
	paid: 'bg-green-100 text-green-800',
	partially_paid: 'bg-blue-100 text-blue-800',
	overdue: 'bg-red-100 text-red-800',
	cancelled: 'bg-gray-100 text-gray-500',
};

export function BillDetail({ billId }: { billId: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [bill, setBill] = useState<Bill | null>(null);
	const [loading, setLoading] = useState(true);
	const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
	const [paymentData, setPaymentData] = useState({
		amount: 0,
		paymentDate: new Date().toISOString().split('T')[0],
		paymentMethod: 'bank_transfer',
		referenceNumber: '',
	});

	useEffect(() => {
		if (companyId && billId) {
			fetchBill();
		}
	}, [companyId, billId]);

	const fetchBill = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`/api/finance/bills/${billId}?company=${companyId}`
			);
			if (response.ok) {
				const data = await response.json();
				setBill(data);
				setPaymentData((prev) => ({
					...prev,
					amount: data.balanceDue || 0,
				}));
			}
		} catch (error) {
			console.error('Error fetching bill:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsPaid = async () => {
		try {
			const response = await fetch(
				`/api/finance/bills/${billId}/mark-paid?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Bill marked as paid' });
				fetchBill();
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to update bill' });
		}
	};

	const handleRecordPayment = async () => {
		try {
			const response = await fetch(
				`/api/finance/bills/${billId}/payments?company=${companyId}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(paymentData),
				}
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Payment recorded' });
				setPaymentDialogOpen(false);
				fetchBill();
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

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this bill?')) return;
		try {
			const response = await fetch(
				`/api/finance/bills/${billId}?company=${companyId}`,
				{ method: 'DELETE' }
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Bill deleted' });
				router.push(`/finance/bills?company=${companyId}`);
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to delete bill' });
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

	if (!bill) {
		return (
			<div className='p-6 text-center'>
				<p className='text-gray-500'>Bill not found</p>
				<Button
					variant='link'
					onClick={() => router.push(`/finance/bills?company=${companyId}`)}
				>
					Go back to bills
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
							<h1 className='text-2xl font-bold'>{bill.billNumber}</h1>
							<Badge className={statusColors[bill.status]}>
								{bill.status.replace('_', ' ')}
							</Badge>
						</div>
						<p className='text-gray-500'>
							{bill.vendorInvoiceNumber
								? `Vendor Invoice: ${bill.vendorInvoiceNumber}`
								: 'Bill'}
						</p>
					</div>
				</div>

				<div className='flex gap-2'>
					{bill.status !== 'paid' && bill.status !== 'cancelled' && (
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
											Balance due: {formatCurrency(bill.balanceDue, bill.currency)}
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
										`/finance/bills/${billId}/edit?company=${companyId}`
									)
								}
							>
								<Edit className='h-4 w-4 mr-2' />
								Edit
							</DropdownMenuItem>
							{bill.status !== 'paid' && (
								<DropdownMenuItem onClick={handleMarkAsPaid}>
									<CheckCircle className='h-4 w-4 mr-2' />
									Mark as Paid
								</DropdownMenuItem>
							)}
							<DropdownMenuItem>
								<Download className='h-4 w-4 mr-2' />
								Download PDF
							</DropdownMenuItem>
							{bill.status !== 'paid' && (
								<DropdownMenuItem onClick={handleDelete} className='text-red-600'>
									<Trash2 className='h-4 w-4 mr-2' />
									Delete
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Bill Preview Card */}
			<Card>
				<CardContent className='p-8'>
					{/* Header Section */}
					<div className='flex justify-between mb-8'>
						<div>
							<h2 className='text-xl font-bold mb-1'>BILL</h2>
							<p className='text-gray-600'>{bill.billNumber}</p>
						</div>
						<div className='text-right'>
							<div className='text-sm text-gray-500'>Bill Date</div>
							<div className='font-medium'>
								{new Date(bill.billDate).toLocaleDateString('en-IN', {
									day: '2-digit',
									month: 'short',
									year: 'numeric',
								})}
							</div>
							{bill.dueDate && (
								<>
									<div className='text-sm text-gray-500 mt-2'>Due Date</div>
									<div className='font-medium'>
										{new Date(bill.dueDate).toLocaleDateString('en-IN', {
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

					{/* Vendor */}
					<div className='mb-8'>
						<div className='text-sm text-gray-500 mb-2'>Vendor</div>
						{bill.vendor ? (
							<div>
								<div className='font-semibold text-lg'>{bill.vendor.name}</div>
								{bill.vendor.billingAddress && (
									<div className='text-gray-600'>{bill.vendor.billingAddress}</div>
								)}
								{(bill.vendor.city || bill.vendor.state) && (
									<div className='text-gray-600'>
										{[bill.vendor.city, bill.vendor.state]
											.filter(Boolean)
											.join(', ')}
									</div>
								)}
								{bill.vendor.gstNumber && (
									<div className='text-gray-600'>
										GSTIN: {bill.vendor.gstNumber}
									</div>
								)}
							</div>
						) : (
							<div className='text-gray-400 italic'>No vendor selected</div>
						)}
					</div>

					{/* Line Items */}
					<Table>
						<TableHeader>
							<TableRow className='bg-gray-50'>
								<TableHead className='w-[40%]'>Description</TableHead>
								<TableHead>SAC/HSN</TableHead>
								<TableHead className='text-right'>Qty</TableHead>
								<TableHead className='text-right'>Rate</TableHead>
								<TableHead className='text-right'>Tax</TableHead>
								<TableHead className='text-right'>Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{bill.lineItems && bill.lineItems.length > 0 ? (
								bill.lineItems.map((item, index) => (
									<TableRow key={item.id || index}>
										<TableCell>{item.description}</TableCell>
										<TableCell>{item.sacCode || item.hsnCode || '-'}</TableCell>
										<TableCell className='text-right'>{item.quantity}</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(item.rate, bill.currency)}
										</TableCell>
										<TableCell className='text-right'>{item.taxRate}%</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(item.totalAmount, bill.currency)}
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
								<span>{formatCurrency(bill.subtotal, bill.currency)}</span>
							</div>
							<div className='flex justify-between'>
								<span className='text-gray-600'>Tax</span>
								<span>{formatCurrency(bill.taxAmount, bill.currency)}</span>
							</div>
							<Separator />
							<div className='flex justify-between text-lg font-bold'>
								<span>Total</span>
								<span>{formatCurrency(bill.totalAmount, bill.currency)}</span>
							</div>
							{bill.paidAmount > 0 && (
								<>
									<div className='flex justify-between text-green-600'>
										<span>Paid</span>
										<span>
											-{formatCurrency(bill.paidAmount, bill.currency)}
										</span>
									</div>
									<div className='flex justify-between font-bold'>
										<span>Balance Due</span>
										<span>
											{formatCurrency(bill.balanceDue, bill.currency)}
										</span>
									</div>
								</>
							)}
						</div>
					</div>

					{/* Notes */}
					{bill.notes && (
						<div className='mt-8 pt-6 border-t'>
							<div className='text-sm text-gray-500 mb-2'>Notes</div>
							<p className='text-gray-700 whitespace-pre-wrap'>{bill.notes}</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Payment History */}
			{bill.payments && bill.payments.length > 0 && (
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
								{bill.payments.map((payment) => (
									<TableRow key={payment.id}>
										<TableCell>
											{new Date(payment.paymentDate).toLocaleDateString()}
										</TableCell>
										<TableCell className='capitalize'>
											{payment.paymentMethod.replace('_', ' ')}
										</TableCell>
										<TableCell>{payment.referenceNumber || '-'}</TableCell>
										<TableCell className='text-right font-medium'>
											{formatCurrency(payment.amount, bill.currency)}
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
