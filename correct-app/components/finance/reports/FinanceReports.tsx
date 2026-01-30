'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { EmptyState, CardSkeleton } from '@/components/finance/shared/EmptyState';
import { exportRevenueReportToCsv } from '@/lib/utils/csv-export';

interface InvoiceSummary {
	invoiced: number;
	received: number;
	outstanding: number;
}

interface RevenueData {
	month: string;
	invoiced: number;
	received: number;
}

interface AccountsReceivable {
	clientId: string;
	clientName: string;
	totalOutstanding: number;
	invoices: {
		id: string;
		invoiceNumber: string;
		amount: number;
		dueDate: string;
	}[];
}

interface AccountsPayable {
	totalPayable: number;
	bills: {
		id: string;
		billNumber: string;
		vendorName: string;
		amount: number;
		dueDate: string;
	}[];
}

export function FinanceReports() {
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [loading, setLoading] = useState(true);
	const [period, setPeriod] = useState('12');
	const [invoiceSummary, setInvoiceSummary] = useState<InvoiceSummary | null>(null);
	const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
	const [accountsReceivable, setAccountsReceivable] = useState<AccountsReceivable[]>([]);
	const [accountsPayable, setAccountsPayable] = useState<AccountsPayable | null>(null);

	useEffect(() => {
		if (companyId) {
			fetchReports();
		}
	}, [companyId, period]);

	const fetchReports = async () => {
		try {
			setLoading(true);
			const [summaryRes, revenueRes, receivableRes, payableRes] = await Promise.all([
				fetch(`/api/finance/dashboard/invoice-summary?company=${companyId}`),
				fetch(`/api/finance/dashboard/revenue-chart?company=${companyId}&months=${period}`),
				fetch(`/api/finance/dashboard/accounts-receivable?company=${companyId}`),
				fetch(`/api/finance/dashboard/accounts-payable?company=${companyId}`),
			]);

			if (summaryRes.ok) {
				setInvoiceSummary(await summaryRes.json());
			}
			if (revenueRes.ok) {
				setRevenueData(await revenueRes.json());
			}
			if (receivableRes.ok) {
				setAccountsReceivable(await receivableRes.json());
			}
			if (payableRes.ok) {
				setAccountsPayable(await payableRes.json());
			}
		} catch (error) {
			console.error('Error fetching reports:', error);
		} finally {
			setLoading(false);
		}
	};

	const formatMonth = (monthStr: string) => {
		const [year, month] = monthStr.split('-');
		const date = new Date(parseInt(year), parseInt(month) - 1);
		return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
	};

	if (loading) {
		return (
			<div className='p-6 space-y-6'>
				<div className='h-8 w-48 bg-gray-200 rounded animate-pulse' />
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					<CardSkeleton />
					<CardSkeleton />
					<CardSkeleton />
				</div>
			</div>
		);
	}

	const hasData =
		invoiceSummary &&
		(invoiceSummary.invoiced > 0 ||
			invoiceSummary.received > 0 ||
			revenueData.length > 0);

	if (!hasData) {
		return (
			<div className='p-6'>
				<h1 className='text-2xl font-bold text-gray-900 mb-6'>Financial Reports</h1>
				<Card>
					<CardContent>
						<EmptyState
							type='reports'
							actionHref={`/finance/invoices/new?company=${companyId}`}
						/>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='p-6 space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Financial Reports</h1>
					<p className='text-gray-500'>Analyze your financial performance</p>
				</div>
				<div className='flex gap-2'>
					<Select value={period} onValueChange={setPeriod}>
						<SelectTrigger className='w-40'>
							<Calendar className='h-4 w-4 mr-2' />
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='3'>Last 3 Months</SelectItem>
							<SelectItem value='6'>Last 6 Months</SelectItem>
							<SelectItem value='12'>Last 12 Months</SelectItem>
						</SelectContent>
					</Select>
					<Button
						variant='outline'
						onClick={() => exportRevenueReportToCsv(revenueData)}
						disabled={revenueData.length === 0}
					>
						<Download className='h-4 w-4 mr-2' />
						Export
					</Button>
				</div>
			</div>

			{/* Summary Cards */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-500'>Total Invoiced</p>
								<p className='text-2xl font-bold mt-1'>
									{formatCurrency(invoiceSummary?.invoiced || 0, 'INR')}
								</p>
								<p className='text-xs text-gray-400 mt-1'>This financial year</p>
							</div>
							<div className='p-3 rounded-full bg-blue-100'>
								<TrendingUp className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-500'>Total Received</p>
								<p className='text-2xl font-bold mt-1 text-green-600'>
									{formatCurrency(invoiceSummary?.received || 0, 'INR')}
								</p>
								<p className='text-xs text-gray-400 mt-1'>This financial year</p>
							</div>
							<div className='p-3 rounded-full bg-green-100'>
								<DollarSign className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className='p-6'>
						<div className='flex items-center justify-between'>
							<div>
								<p className='text-sm font-medium text-gray-500'>Outstanding</p>
								<p className='text-2xl font-bold mt-1 text-red-600'>
									{formatCurrency(invoiceSummary?.outstanding || 0, 'INR')}
								</p>
								<p className='text-xs text-gray-400 mt-1'>Pending collection</p>
							</div>
							<div className='p-3 rounded-full bg-red-100'>
								<TrendingDown className='h-6 w-6 text-red-600' />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Revenue Chart */}
			<Card>
				<CardHeader>
					<CardTitle>Revenue Overview</CardTitle>
				</CardHeader>
				<CardContent>
					{revenueData.length === 0 ? (
						<div className='text-center py-8 text-gray-500'>
							No revenue data available for the selected period
						</div>
					) : (
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Month</TableHead>
										<TableHead className='text-right'>Invoiced</TableHead>
										<TableHead className='text-right'>Received</TableHead>
										<TableHead className='text-right'>Collection Rate</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{revenueData.map((row) => {
										const collectionRate =
											row.invoiced > 0
												? ((row.received / row.invoiced) * 100).toFixed(1)
												: '0';
										return (
											<TableRow key={row.month}>
												<TableCell className='font-medium'>
													{formatMonth(row.month)}
												</TableCell>
												<TableCell className='text-right'>
													{formatCurrency(row.invoiced, 'INR')}
												</TableCell>
												<TableCell className='text-right text-green-600'>
													{formatCurrency(row.received, 'INR')}
												</TableCell>
												<TableCell className='text-right'>
													{collectionRate}%
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Accounts Tabs */}
			<Tabs defaultValue='receivable'>
				<TabsList>
					<TabsTrigger value='receivable'>Accounts Receivable</TabsTrigger>
					<TabsTrigger value='payable'>Accounts Payable</TabsTrigger>
				</TabsList>

				<TabsContent value='receivable'>
					<Card>
						<CardHeader>
							<CardTitle>Accounts Receivable</CardTitle>
						</CardHeader>
						<CardContent>
							{accountsReceivable.length === 0 ? (
								<div className='text-center py-8 text-gray-500'>
									No outstanding receivables
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Client</TableHead>
											<TableHead>Invoice #</TableHead>
											<TableHead>Due Date</TableHead>
											<TableHead className='text-right'>Amount</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{accountsReceivable.flatMap((ar) =>
											ar.invoices.map((inv) => (
												<TableRow key={inv.id}>
													<TableCell className='font-medium'>
														{ar.clientName}
													</TableCell>
													<TableCell>{inv.invoiceNumber}</TableCell>
													<TableCell>
														{new Date(inv.dueDate).toLocaleDateString()}
													</TableCell>
													<TableCell className='text-right'>
														{formatCurrency(inv.amount, 'INR')}
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='payable'>
					<Card>
						<CardHeader>
							<div className='flex justify-between items-center'>
								<CardTitle>Accounts Payable</CardTitle>
								{accountsPayable && accountsPayable.totalPayable > 0 && (
									<div className='text-lg font-semibold text-red-600'>
										Total: {formatCurrency(accountsPayable.totalPayable, 'INR')}
									</div>
								)}
							</div>
						</CardHeader>
						<CardContent>
							{!accountsPayable || accountsPayable.bills.length === 0 ? (
								<div className='text-center py-8 text-gray-500'>
									No outstanding payables
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Vendor</TableHead>
											<TableHead>Bill #</TableHead>
											<TableHead>Due Date</TableHead>
											<TableHead className='text-right'>Amount</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{accountsPayable.bills.map((bill) => (
											<TableRow key={bill.id}>
												<TableCell className='font-medium'>
													{bill.vendorName}
												</TableCell>
												<TableCell>{bill.billNumber}</TableCell>
												<TableCell>
													{new Date(bill.dueDate).toLocaleDateString()}
												</TableCell>
												<TableCell className='text-right'>
													{formatCurrency(bill.amount, 'INR')}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
