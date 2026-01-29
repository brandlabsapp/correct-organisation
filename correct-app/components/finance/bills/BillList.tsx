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
	Download,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { EmptyState, ListSkeleton } from '@/components/finance/shared/EmptyState';
import { exportBillsToCsv } from '@/lib/utils/csv-export';

interface Bill {
	id: string;
	billNumber: string;
	billDate: string;
	dueDate: string;
	status: string;
	totalAmount: number;
	balanceDue: number;
	currency: string;
	vendorInvoiceNumber: string;
	vendor?: {
		id: string;
		name: string;
	};
}

const statusColors: Record<string, string> = {
	draft: 'bg-gray-100 text-gray-800',
	unpaid: 'bg-yellow-100 text-yellow-800',
	paid: 'bg-green-100 text-green-800',
	partially_paid: 'bg-blue-100 text-blue-800',
	overdue: 'bg-red-100 text-red-800',
	cancelled: 'bg-gray-100 text-gray-500',
};

const statusFilters = [
	{ label: 'All', value: '' },
	{ label: 'Draft', value: 'draft' },
	{ label: 'Unpaid', value: 'unpaid' },
	{ label: 'Paid', value: 'paid' },
	{ label: 'Overdue', value: 'overdue' },
];

export function BillList() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [bills, setBills] = useState<Bill[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('');
	const [total, setTotal] = useState(0);

	useEffect(() => {
		if (companyId) {
			fetchBills();
		}
	}, [companyId, statusFilter]);

	const fetchBills = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({ company: companyId! });
			if (statusFilter) params.append('status', statusFilter);
			if (search) params.append('search', search);

			const response = await fetch(`/api/finance/bills?${params}`);
			if (response.ok) {
				const data = await response.json();
				setBills(data.rows || []);
				setTotal(data.count || 0);
			}
		} catch (error) {
			console.error('Error fetching bills:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsPaid = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/bills/${id}/mark-paid?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				fetchBills();
			}
		} catch (error) {
			console.error('Error marking bill as paid:', error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this bill?')) return;
		try {
			const response = await fetch(
				`/api/finance/bills/${id}?company=${companyId}`,
				{ method: 'DELETE' }
			);
			if (response.ok) {
				fetchBills();
			}
		} catch (error) {
			console.error('Error deleting bill:', error);
		}
	};

	return (
		<div className='p-6 space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Bills</h1>
					<p className='text-gray-500'>Track your expenses and vendor bills</p>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						onClick={() => exportBillsToCsv(bills)}
						disabled={bills.length === 0}
					>
						<Download className='h-4 w-4 mr-2' />
						Export CSV
					</Button>
					<Link href={`/finance/bills/new?company=${companyId}`}>
						<Button className='bg-green hover:bg-green/90'>
							<Plus className='h-4 w-4 mr-2' />
							New Bill
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
									placeholder='Search bills...'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && fetchBills()}
									className='pl-10 w-64'
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bills Table */}
			<Card>
				<CardContent className='p-0'>
					{loading ? (
						<ListSkeleton rows={5} />
					) : bills.length === 0 ? (
						<EmptyState
							type='bills'
							actionHref={`/finance/bills/new?company=${companyId}`}
						/>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Bill #</TableHead>
									<TableHead>Vendor</TableHead>
									<TableHead>Vendor Inv #</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Due Date</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className='text-right'>Amount</TableHead>
									<TableHead className='text-right'>Balance</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{bills.map((bill) => (
									<TableRow key={bill.id}>
										<TableCell className='font-medium'>
											{bill.billNumber}
										</TableCell>
										<TableCell>{bill.vendor?.name || 'No Vendor'}</TableCell>
										<TableCell>{bill.vendorInvoiceNumber || '-'}</TableCell>
										<TableCell>
											{new Date(bill.billDate).toLocaleDateString()}
										</TableCell>
										<TableCell>
											{bill.dueDate
												? new Date(bill.dueDate).toLocaleDateString()
												: '-'}
										</TableCell>
										<TableCell>
											<Badge className={statusColors[bill.status]}>
												{bill.status.replace('_', ' ')}
											</Badge>
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(bill.totalAmount, bill.currency)}
										</TableCell>
										<TableCell className='text-right'>
											{formatCurrency(bill.balanceDue, bill.currency)}
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
																`/finance/bills/${bill.id}?company=${companyId}`
															)
														}
													>
														<Eye className='h-4 w-4 mr-2' />
														View
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() =>
															router.push(
																`/finance/bills/${bill.id}/edit?company=${companyId}`
															)
														}
													>
														<Edit className='h-4 w-4 mr-2' />
														Edit
													</DropdownMenuItem>
													{bill.status !== 'paid' && (
														<DropdownMenuItem
															onClick={() => handleMarkAsPaid(bill.id)}
														>
															<CheckCircle className='h-4 w-4 mr-2' />
															Mark as Paid
														</DropdownMenuItem>
													)}
													{bill.status !== 'paid' && (
														<DropdownMenuItem
															onClick={() => handleDelete(bill.id)}
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
					Showing {bills.length} of {total} bills
				</div>
			)}
		</div>
	);
}
