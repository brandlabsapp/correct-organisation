'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import {
	Plus,
	Search,
	MoreHorizontal,
	Eye,
	Edit,
	Trash2,
	CheckCircle,
	XCircle,
	FileText,
	Send,
	Download,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';
import { EmptyState, ListSkeleton } from '@/components/finance/shared/EmptyState';
import { exportEstimatesToCsv } from '@/lib/utils/csv-export';

interface Estimate {
	id: string;
	estimateNumber: string;
	estimateDate: string;
	expiryDate: string;
	status: string;
	totalAmount: number;
	currency: string;
	convertedToInvoice: boolean;
	client?: {
		id: string;
		name: string;
	};
}

const statusColors: Record<string, string> = {
	draft: 'bg-gray-100 text-gray-800',
	sent: 'bg-blue-100 text-blue-800',
	viewed: 'bg-purple-100 text-purple-800',
	accepted: 'bg-green-100 text-green-800',
	rejected: 'bg-red-100 text-red-800',
	expired: 'bg-orange-100 text-orange-800',
};

const statusFilters = [
	{ label: 'All', value: '' },
	{ label: 'Draft', value: 'draft' },
	{ label: 'Sent', value: 'sent' },
	{ label: 'Accepted', value: 'accepted' },
	{ label: 'Pending', value: 'sent' },
	{ label: 'Expired', value: 'expired' },
];

export function EstimateList() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [estimates, setEstimates] = useState<Estimate[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [total, setTotal] = useState(0);

	useEffect(() => {
		if (companyId) {
			fetchEstimates();
		}
	}, [companyId, statusFilter]);

	const fetchEstimates = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({ company: companyId! });
			if (statusFilter) params.append('status', statusFilter);
			if (search) params.append('search', search);

			const response = await fetch(`/api/finance/estimates?${params}`);
			if (response.ok) {
				const data = await response.json();
				setEstimates(data.rows || []);
				setTotal(data.count || 0);
			}
		} catch (error) {
			console.error('Error fetching estimates:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsSent = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/estimates/${id}/mark-sent?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				fetchEstimates();
			}
		} catch (error) {
			console.error('Error marking estimate as sent:', error);
		}
	};

	const handleAccept = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/estimates/${id}/accept?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				fetchEstimates();
			}
		} catch (error) {
			console.error('Error accepting estimate:', error);
		}
	};

	const handleReject = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/estimates/${id}/reject?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				fetchEstimates();
			}
		} catch (error) {
			console.error('Error rejecting estimate:', error);
		}
	};

	const handleConvertToInvoice = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/estimates/${id}/convert-to-invoice?company=${companyId}`,
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
			console.error('Error converting estimate:', error);
			showErrorToast({
				title: 'Error',
				message: 'Failed to convert estimate',
			});
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this estimate?')) return;
		try {
			const response = await fetch(
				`/api/finance/estimates/${id}?company=${companyId}`,
				{ method: 'DELETE' }
			);
			if (response.ok) {
				fetchEstimates();
			}
		} catch (error) {
			console.error('Error deleting estimate:', error);
		}
	};

	return (
		<div className='p-6 space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Estimates</h1>
					<p className='text-gray-500'>Create and manage quotes for your clients</p>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						onClick={() => exportEstimatesToCsv(estimates)}
						disabled={estimates.length === 0}
					>
						<Download className='h-4 w-4 mr-2' />
						Export CSV
					</Button>
					<Link href={`/finance/estimates/new?company=${companyId}`}>
						<Button className='bg-green hover:bg-green/90'>
							<Plus className='h-4 w-4 mr-2' />
							New Estimate
						</Button>
					</Link>
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className='p-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='flex gap-2 overflow-x-auto pb-2 sm:pb-0'>
							{statusFilters.map((filter) => (
								<Button
									key={filter.value}
									variant={statusFilter === filter.value ? 'default' : 'outline'}
									size='sm'
									onClick={() => setStatusFilter(filter.value)}
									className={cn(
										statusFilter === filter.value && 'bg-green hover:bg-green/90'
									)}
								>
									{filter.label}
								</Button>
							))}
						</div>

						<div className='flex gap-2 ml-auto'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
								<Input
									placeholder='Search estimates...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && fetchEstimates()}
									className='pl-10 w-64'
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Estimates Table */}
			<Card>
				<CardContent className='p-0'>
					{loading ? (
						<ListSkeleton rows={5} />
					) : estimates.length === 0 ? (
						<EmptyState
							type='estimates'
							actionHref={`/finance/estimates/new?company=${companyId}`}
						/>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Estimate #</TableHead>
									<TableHead>Client</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Expiry</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>Amount</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{estimates.map((estimate) => (
									<TableRow key={estimate.id}>
										<TableCell className='font-medium'>
											{estimate.estimateNumber}
											{estimate.convertedToInvoice && (
												<Badge variant='outline' className='ml-2'>
													Converted
												</Badge>
											)}
										</TableCell>
										<TableCell>{estimate.client?.name || 'No Client'}</TableCell>
										<TableCell>
											{new Date(estimate.estimateDate).toLocaleDateString()}
										</TableCell>
										<TableCell>
											{estimate.expiryDate
												? new Date(estimate.expiryDate).toLocaleDateString()
												: '-'}
										</TableCell>
										<TableCell>
											<Badge className={statusColors[estimate.status]}>
												{estimate.status}
											</Badge>
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(estimate.totalAmount, estimate.currency)}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' size='icon'>
														<MoreHorizontal className='h-4 w-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													<DropdownMenuItem
														onClick={() =>
															router.push(
																`/finance/estimates/${estimate.id}?company=${companyId}`
															)
														}
													>
														<Eye className='h-4 w-4 mr-2' />
														View
													</DropdownMenuItem>
													{!estimate.convertedToInvoice && (
														<DropdownMenuItem
															onClick={() =>
																router.push(
																	`/finance/estimates/${estimate.id}/edit?company=${companyId}`
																)
															}
														>
															<Edit className='h-4 w-4 mr-2' />
															Edit
														</DropdownMenuItem>
													)}
													{estimate.status === 'draft' && (
														<DropdownMenuItem
															onClick={() => handleMarkAsSent(estimate.id)}
														>
															<Send className='h-4 w-4 mr-2' />
															Mark as Sent
														</DropdownMenuItem>
													)}
													{['sent', 'viewed'].includes(estimate.status) && (
														<>
															<DropdownMenuItem
																onClick={() => handleAccept(estimate.id)}
															>
																<CheckCircle className='h-4 w-4 mr-2' />
																Mark Accepted
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleReject(estimate.id)}
															>
																<XCircle className='h-4 w-4 mr-2' />
																Mark Rejected
															</DropdownMenuItem>
														</>
													)}
													{estimate.status === 'accepted' &&
														!estimate.convertedToInvoice && (
															<DropdownMenuItem
																onClick={() =>
																	handleConvertToInvoice(estimate.id)
																}
															>
																<FileText className='h-4 w-4 mr-2' />
																Convert to Invoice
															</DropdownMenuItem>
														)}
													{!estimate.convertedToInvoice && (
														<DropdownMenuItem
															onClick={() => handleDelete(estimate.id)}
															className='text-red-600'
														>
															<Trash2 className='h-4 w-4 mr-2' />
															Delete
														</DropdownMenuItem>
													)}
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

			{total > 0 && (
				<div className='text-sm text-gray-500'>
					Showing {estimates.length} of {total} estimates
				</div>
			)}
		</div>
	);
}
