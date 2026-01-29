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
	ArrowLeft,
	Edit,
	Trash2,
	MoreVertical,
	Download,
	Send,
	CheckCircle,
	XCircle,
	FileText,
	Mail,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';

interface Estimate {
	id: string;
	estimateNumber: string;
	estimateDate: string;
	expiryDate: string;
	status: string;
	totalAmount: number;
	subtotal: number;
	taxAmount: number;
	discountAmount: number;
	currency: string;
	notes: string;
	termsAndConditions: string;
	title: string;
	description: string;
	convertedToInvoice: boolean;
	invoiceId: string;
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
		discountPercent: number;
		amount: number;
		taxAmount: number;
		totalAmount: number;
		sacCode: string;
	}[];
}

const statusColors: Record<string, string> = {
	draft: 'bg-gray-100 text-gray-800',
	sent: 'bg-blue-100 text-blue-800',
	viewed: 'bg-purple-100 text-purple-800',
	accepted: 'bg-green-100 text-green-800',
	rejected: 'bg-red-100 text-red-800',
	expired: 'bg-orange-100 text-orange-800',
};

export function EstimateDetail({ estimateId }: { estimateId: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [estimate, setEstimate] = useState<Estimate | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (companyId && estimateId) {
			fetchEstimate();
		}
	}, [companyId, estimateId]);

	const fetchEstimate = async () => {
		try {
			setLoading(true);
			const response = await fetch(
				`/api/finance/estimates/${estimateId}?company=${companyId}`
			);
			if (response.ok) {
				const data = await response.json();
				setEstimate(data);
			}
		} catch (error) {
			console.error('Error fetching estimate:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsSent = async () => {
		try {
			const response = await fetch(
				`/api/finance/estimates/${estimateId}/mark-sent?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Estimate marked as sent' });
				fetchEstimate();
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to update estimate' });
		}
	};

	const handleAccept = async () => {
		try {
			const response = await fetch(
				`/api/finance/estimates/${estimateId}/accept?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Estimate accepted' });
				fetchEstimate();
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to accept estimate' });
		}
	};

	const handleReject = async () => {
		try {
			const response = await fetch(
				`/api/finance/estimates/${estimateId}/reject?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Estimate rejected' });
				fetchEstimate();
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to reject estimate' });
		}
	};

	const handleConvertToInvoice = async () => {
		try {
			const response = await fetch(
				`/api/finance/estimates/${estimateId}/convert-to-invoice?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				const data = await response.json();
				showSuccessToast({
					title: 'Success',
					message: 'Estimate converted to invoice',
				});
				router.push(`/finance/invoices/${data.invoiceId}?company=${companyId}`);
			}
		} catch (error) {
			showErrorToast({
				title: 'Error',
				message: 'Failed to convert estimate',
			});
		}
	};

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this estimate?')) return;
		try {
			const response = await fetch(
				`/api/finance/estimates/${estimateId}?company=${companyId}`,
				{ method: 'DELETE' }
			);
			if (response.ok) {
				showSuccessToast({ title: 'Success', message: 'Estimate deleted' });
				router.push(`/finance/estimates?company=${companyId}`);
			}
		} catch (error) {
			showErrorToast({ title: 'Error', message: 'Failed to delete estimate' });
		}
	};

	if (loading) {
		return (
			<div className='p-6 animate-pulse space-y-6'>
				<div className='h-8 w-64 bg-gray-200 rounded' />
				<div className='h-64 bg-gray-200 rounded-lg' />
			</div>
		);
	}

	if (!estimate) {
		return (
			<div className='p-6 text-center'>
				<p className='text-gray-500'>Estimate not found</p>
				<Button
					variant='link'
					onClick={() => router.push(`/finance/estimates?company=${companyId}`)}
				>
					Go back to estimates
				</Button>
			</div>
		);
	}

	const canEdit = !estimate.convertedToInvoice;
	const canConvert =
		estimate.status === 'accepted' && !estimate.convertedToInvoice;
	const canAcceptReject = ['sent', 'viewed'].includes(estimate.status);

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
							<h1 className='text-2xl font-bold'>{estimate.estimateNumber}</h1>
							<Badge className={statusColors[estimate.status]}>
								{estimate.status}
							</Badge>
							{estimate.convertedToInvoice && (
								<Badge variant='outline' className='ml-1'>
									Converted
								</Badge>
							)}
						</div>
						<p className='text-gray-500'>{estimate.title || 'Estimate'}</p>
					</div>
				</div>

				<div className='flex gap-2'>
					{estimate.status === 'draft' && (
						<Button variant='outline' onClick={handleMarkAsSent}>
							<Send className='h-4 w-4 mr-2' />
							Mark as Sent
						</Button>
					)}
					{canConvert && (
						<Button
							className='bg-green hover:bg-green/90'
							onClick={handleConvertToInvoice}
						>
							<FileText className='h-4 w-4 mr-2' />
							Convert to Invoice
						</Button>
					)}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' size='icon'>
								<MoreVertical className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							{canEdit && (
								<DropdownMenuItem
									onClick={() =>
										router.push(
											`/finance/estimates/${estimateId}/edit?company=${companyId}`
										)
									}
								>
									<Edit className='h-4 w-4 mr-2' />
									Edit
								</DropdownMenuItem>
							)}
							{canAcceptReject && (
								<>
									<DropdownMenuItem onClick={handleAccept}>
										<CheckCircle className='h-4 w-4 mr-2' />
										Mark Accepted
									</DropdownMenuItem>
									<DropdownMenuItem onClick={handleReject}>
										<XCircle className='h-4 w-4 mr-2' />
										Mark Rejected
									</DropdownMenuItem>
								</>
							)}
							<DropdownMenuItem>
								<Download className='h-4 w-4 mr-2' />
								Download PDF
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Mail className='h-4 w-4 mr-2' />
								Send Email
							</DropdownMenuItem>
							{estimate.convertedToInvoice && estimate.invoiceId && (
								<DropdownMenuItem
									onClick={() =>
										router.push(
											`/finance/invoices/${estimate.invoiceId}?company=${companyId}`
										)
									}
								>
									<FileText className='h-4 w-4 mr-2' />
									View Invoice
								</DropdownMenuItem>
							)}
							{canEdit && (
								<DropdownMenuItem onClick={handleDelete} className='text-red-600'>
									<Trash2 className='h-4 w-4 mr-2' />
									Delete
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Estimate Preview Card */}
			<Card>
				<CardContent className='p-8'>
					{/* Header Section */}
					<div className='flex justify-between mb-8'>
						<div>
							<h2 className='text-xl font-bold mb-1'>ESTIMATE</h2>
							<p className='text-gray-600'>{estimate.estimateNumber}</p>
							{estimate.description && (
								<p className='text-gray-500 mt-2'>{estimate.description}</p>
							)}
						</div>
						<div className='text-right'>
							<div className='text-sm text-gray-500'>Estimate Date</div>
							<div className='font-medium'>
								{new Date(estimate.estimateDate).toLocaleDateString('en-IN', {
									day: '2-digit',
									month: 'short',
									year: 'numeric',
								})}
							</div>
							{estimate.expiryDate && (
								<>
									<div className='text-sm text-gray-500 mt-2'>Valid Until</div>
									<div className='font-medium'>
										{new Date(estimate.expiryDate).toLocaleDateString('en-IN', {
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

					{/* Client */}
					<div className='mb-8'>
						<div className='text-sm text-gray-500 mb-2'>Client</div>
						{estimate.client ? (
							<div>
								<div className='font-semibold text-lg'>{estimate.client.name}</div>
								{estimate.client.billingAddress && (
									<div className='text-gray-600'>
										{estimate.client.billingAddress}
									</div>
								)}
								{(estimate.client.city || estimate.client.state) && (
									<div className='text-gray-600'>
										{[estimate.client.city, estimate.client.state]
											.filter(Boolean)
											.join(', ')}
									</div>
								)}
								{estimate.client.gstNumber && (
									<div className='text-gray-600'>
										GSTIN: {estimate.client.gstNumber}
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
								<TableHead className='w-[35%]'>Description</TableHead>
								<TableHead>SAC Code</TableHead>
								<TableHead className='text-right'>Qty</TableHead>
								<TableHead className='text-right'>Rate</TableHead>
								<TableHead className='text-right'>Disc</TableHead>
								<TableHead className='text-right'>Tax</TableHead>
								<TableHead className='text-right'>Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{estimate.lineItems && estimate.lineItems.length > 0 ? (
								estimate.lineItems.map((item, index) => (
									<TableRow key={item.id || index}>
										<TableCell>{item.description}</TableCell>
										<TableCell>{item.sacCode || '-'}</TableCell>
										<TableCell className='text-right'>{item.quantity}</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(item.rate, estimate.currency)}
										</TableCell>
										<TableCell className='text-right'>
											{item.discountPercent > 0 ? `${item.discountPercent}%` : '-'}
										</TableCell>
										<TableCell className='text-right'>{item.taxRate}%</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(item.totalAmount, estimate.currency)}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={7} className='text-center text-gray-400'>
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
								<span>{formatCurrency(estimate.subtotal, estimate.currency)}</span>
							</div>
							{estimate.discountAmount > 0 && (
								<div className='flex justify-between text-green-600'>
									<span>Discount</span>
									<span>
										-{formatCurrency(estimate.discountAmount, estimate.currency)}
									</span>
								</div>
							)}
							<div className='flex justify-between'>
								<span className='text-gray-600'>Tax</span>
								<span>{formatCurrency(estimate.taxAmount, estimate.currency)}</span>
							</div>
							<Separator />
							<div className='flex justify-between text-lg font-bold'>
								<span>Total</span>
								<span>{formatCurrency(estimate.totalAmount, estimate.currency)}</span>
							</div>
						</div>
					</div>

					{/* Notes */}
					{estimate.notes && (
						<div className='mt-8 pt-6 border-t'>
							<div className='text-sm text-gray-500 mb-2'>Notes</div>
							<p className='text-gray-700 whitespace-pre-wrap'>{estimate.notes}</p>
						</div>
					)}

					{/* Terms */}
					{estimate.termsAndConditions && (
						<div className='mt-6'>
							<div className='text-sm text-gray-500 mb-2'>Terms & Conditions</div>
							<p className='text-gray-700 whitespace-pre-wrap'>
								{estimate.termsAndConditions}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
