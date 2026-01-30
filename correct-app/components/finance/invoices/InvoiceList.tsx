'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
	Copy,
	Trash2,
	CheckCircle,
	Send,
	Download,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { EmptyState, ListSkeleton } from '@/components/finance/shared/EmptyState';
import { exportInvoicesToCsv } from '@/lib/utils/csv-export';

interface Invoice {
	id: string;
	invoiceNumber: string;
	invoiceType: string;
	invoiceDate: string;
	dueDate: string;
	status: string;
	totalAmount: number;
	balanceDue: number;
	currency: string;
	client?: {
		id: string;
		name: string;
		email: string;
	};
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

const statusFilters = [
	{ label: 'All', value: '' },
	{ label: 'Draft', value: 'draft' },
	{ label: 'Sent', value: 'sent' },
	{ label: 'Paid', value: 'paid' },
	{ label: 'Unpaid', value: 'sent' },
	{ label: 'Overdue', value: 'overdue' },
];

export function InvoiceList() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [total, setTotal] = useState(0);

	useEffect(() => {
		if (companyId) {
			fetchInvoices();
		}
	}, [companyId, statusFilter]);

	const fetchInvoices = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({ company: companyId! });
			if (statusFilter) params.append('status', statusFilter);
			if (search) params.append('search', search);

			const response = await fetch(`/api/finance/invoices?${params}`);
			if (response.ok) {
				const data = await response.json();
				setInvoices(data.rows || []);
				setTotal(data.count || 0);
			}
		} catch (error) {
			console.error('Error fetching invoices:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = () => {
		fetchInvoices();
	};

	const handleMarkAsPaid = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/invoices/${id}/mark-paid?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				fetchInvoices();
			}
		} catch (error) {
			console.error('Error marking invoice as paid:', error);
		}
	};

	const handleMarkAsSent = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/invoices/${id}/mark-sent?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				fetchInvoices();
			}
		} catch (error) {
			console.error('Error marking invoice as sent:', error);
		}
	};

	const handleDuplicate = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/invoices/${id}/duplicate?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				fetchInvoices();
			}
		} catch (error) {
			console.error('Error duplicating invoice:', error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this invoice?')) return;
		try {
			const response = await fetch(
				`/api/finance/invoices/${id}?company=${companyId}`,
				{ method: 'DELETE' }
			);
			if (response.ok) {
				fetchInvoices();
			}
		} catch (error) {
			console.error('Error deleting invoice:', error);
		}
	};

	return (
		<div className='p-6 space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Invoices</h1>
					<p className='text-gray-500'>Manage your invoices</p>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						onClick={() => exportInvoicesToCsv(invoices)}
						disabled={invoices.length === 0}
					>
						<Download className='h-4 w-4 mr-2' />
						Export CSV
					</Button>
					<Link href={`/finance/invoices/new?company=${companyId}`}>
						<Button className='bg-green hover:bg-green/90'>
							<Plus className='h-4 w-4 mr-2' />
							New Invoice
						</Button>
					</Link>
				</div>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className='p-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						{/* Status Tabs */}
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

						{/* Search */}
						<div className='flex gap-2 ml-auto'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
								<Input
									placeholder='Search invoices...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
									className='pl-10 w-64'
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Invoice Table */}
			<Card>
				<CardContent className='p-0'>
					{loading ? (
						<ListSkeleton rows={5} />
					) : invoices.length === 0 ? (
						<EmptyState
							type='invoices'
							actionHref={`/finance/invoices/new?company=${companyId}`}
						/>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Invoice #</TableHead>
									<TableHead>Client</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Due Date</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>Amount</TableHead>
									<TableHead className='text-right'>Balance</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((invoice) => (
									<TableRow key={invoice.id}>
										<TableCell className='font-medium'>
											{invoice.invoiceNumber}
										</TableCell>
										<TableCell>{invoice.client?.name || 'No Client'}</TableCell>
										<TableCell>
											{new Date(invoice.invoiceDate).toLocaleDateString()}
										</TableCell>
										<TableCell>
											{invoice.dueDate
												? new Date(invoice.dueDate).toLocaleDateString()
												: '-'}
										</TableCell>
										<TableCell>
											<Badge className={statusColors[invoice.status]}>
												{invoice.status.replace('_', ' ')}
											</Badge>
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(invoice.totalAmount, invoice.currency)}
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(invoice.balanceDue, invoice.currency)}
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
																`/finance/invoices/${invoice.id}?company=${companyId}`
															)
														}
													>
														<Eye className='h-4 w-4 mr-2' />
														View
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															router.push(
																`/finance/invoices/${invoice.id}/edit?company=${companyId}`
															)
														}
													>
														<Edit className='h-4 w-4 mr-2' />
														Edit
													</DropdownMenuItem>
													{invoice.status === 'draft' && (
														<DropdownMenuItem
															onClick={() => handleMarkAsSent(invoice.id)}
														>
															<Send className='h-4 w-4 mr-2' />
															Mark as Sent
														</DropdownMenuItem>
													)}
													{invoice.status !== 'paid' && (
														<DropdownMenuItem
															onClick={() => handleMarkAsPaid(invoice.id)}
														>
															<CheckCircle className='h-4 w-4 mr-2' />
															Mark as Paid
														</DropdownMenuItem>
													)}
													<DropdownMenuItem
														onClick={() => handleDuplicate(invoice.id)}
													>
														<Copy className='h-4 w-4 mr-2' />
														Duplicate
													</DropdownMenuItem>
													{invoice.status !== 'paid' && (
														<DropdownMenuItem
															onClick={() => handleDelete(invoice.id)}
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

			{/* Pagination info */}
			{total > 0 && (
				<div className='text-sm text-gray-500'>
					Showing {invoices.length} of {total} invoices
				</div>
			)}
		</div>
	);
}
