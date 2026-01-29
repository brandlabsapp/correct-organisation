'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DollarSign,
	AlertCircle,
	CheckCircle,
	Users,
	TrendingUp,
	TrendingDown,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { EmptyState, CardSkeleton } from '@/components/finance/shared/EmptyState';

interface DashboardMetrics {
	totalOutstanding: number;
	totalOverdue: number;
	totalCollectedThisYear: number;
	totalClients: number;
	totalInvoices: number;
	totalBills: number;
}

interface Activity {
	type: string;
	id: string;
	number: string;
	status: string;
	amount: number;
	timestamp: string;
	description: string;
}

export function FinanceDashboard() {
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');
	const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (companyId) {
			fetchData();
		}
	}, [companyId]);

	const fetchData = async () => {
		try {
			setLoading(true);
			const [metricsRes, activityRes] = await Promise.all([
				fetch(`/api/finance/dashboard/metrics?company=${companyId}`),
				fetch(`/api/finance/dashboard/activity?company=${companyId}&limit=10`),
			]);

			if (metricsRes.ok) {
				const metricsData = await metricsRes.json();
				setMetrics(metricsData);
			}

			if (activityRes.ok) {
				const activityData = await activityRes.json();
				setActivities(activityData);
			}
		} catch (error) {
			console.error('Error fetching dashboard data:', error);
		} finally {
			setLoading(false);
		}
	};

	const MetricCard = ({
		title,
		value,
		icon: Icon,
		color,
		subtext,
	}: {
		title: string;
		value: string | number;
		icon: any;
		color: string;
		subtext?: string;
	}) => (
		<Card>
			<CardContent className='p-6'>
				<div className='flex items-center justify-between'>
					<div>
						<p className='text-sm font-medium text-gray-500'>{title}</p>
						<p className='text-2xl font-bold mt-1'>{value}</p>
						{subtext && <p className='text-xs text-gray-400 mt-1'>{subtext}</p>}
					</div>
					<div className={`p-3 rounded-full ${color}`}>
						<Icon className='h-6 w-6 text-white' />
					</div>
				</div>
			</CardContent>
		</Card>
	);

	if (loading) {
		return (
			<div className='p-6 space-y-6'>
				<div className='h-8 w-48 bg-gray-200 rounded animate-pulse' />
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{[1, 2, 3, 4].map((i) => (
						<CardSkeleton key={i} />
					))}
				</div>
			</div>
		);
	}

	// Check if this is a new user with no data
	const isNewUser =
		metrics &&
		metrics.totalInvoices === 0 &&
		metrics.totalBills === 0 &&
		metrics.totalClients === 0;

	if (isNewUser) {
		return (
			<div className='p-6 space-y-6'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Finance Dashboard</h1>
					<p className='text-gray-500'>Overview of your financial activities</p>
				</div>
				<Card>
					<CardContent>
						<EmptyState
							type='invoices'
							title='Welcome to Finance Management'
							description='Get started by creating your first invoice, adding a client, or recording a bill. All your financial data will appear here.'
							actionHref={`/finance/invoices/new?company=${companyId}`}
							actionLabel='Create Your First Invoice'
						/>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='p-6 space-y-6'>
			<div>
				<h1 className='text-2xl font-bold text-gray-900'>Finance Dashboard</h1>
				<p className='text-gray-500'>Overview of your financial activities</p>
			</div>

			{/* Metrics Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				<MetricCard
					title='Total Outstanding'
					value={formatCurrency(metrics?.totalOutstanding || 0, 'INR')}
					icon={DollarSign}
					color='bg-blue-500'
				/>
				<MetricCard
					title='Total Overdue'
					value={formatCurrency(metrics?.totalOverdue || 0, 'INR')}
					icon={AlertCircle}
					color='bg-red-500'
				/>
				<MetricCard
					title='Collected This Year'
					value={formatCurrency(metrics?.totalCollectedThisYear || 0, 'INR')}
					icon={CheckCircle}
					color='bg-green-500'
				/>
				<MetricCard
					title='Total Clients'
					value={metrics?.totalClients || 0}
					icon={Users}
					color='bg-purple-500'
				/>
			</div>

			{/* Two Column Layout */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* At a Glance */}
				<Card>
					<CardHeader>
						<CardTitle>At a Glance</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='flex justify-between items-center py-2 border-b'>
							<span className='text-gray-600'>Total Invoices</span>
							<span className='font-semibold'>{metrics?.totalInvoices || 0}</span>
						</div>
						<div className='flex justify-between items-center py-2 border-b'>
							<span className='text-gray-600'>Total Bills</span>
							<span className='font-semibold'>{metrics?.totalBills || 0}</span>
						</div>
						<div className='flex justify-between items-center py-2 border-b'>
							<span className='text-gray-600'>Active Clients</span>
							<span className='font-semibold'>{metrics?.totalClients || 0}</span>
						</div>
						<div className='flex justify-between items-center py-2'>
							<span className='text-gray-600'>Outstanding Amount</span>
							<span className='font-semibold text-red-500'>
								{formatCurrency(metrics?.totalOutstanding || 0, 'INR')}
							</span>
						</div>
					</CardContent>
				</Card>

				{/* Recent Activity */}
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						{activities.length === 0 ? (
							<EmptyState
								type='activity'
								title='No recent activity'
								description='Your recent financial activities will appear here'
							/>
						) : (
							<div className='space-y-4'>
								{activities.map((activity, index) => (
									<div
										key={`${activity.type}-${activity.id}`}
										className='flex items-start gap-3 py-2 border-b last:border-0'
									>
										<div
											className={`p-2 rounded-full ${
												activity.type === 'invoice'
													? 'bg-blue-100'
													: 'bg-orange-100'
											}`}
										>
											{activity.type === 'invoice' ? (
												<TrendingUp className='h-4 w-4 text-blue-600' />
											) : (
												<TrendingDown className='h-4 w-4 text-orange-600' />
											)}
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-sm font-medium text-gray-900 truncate'>
												{activity.description}
											</p>
											<p className='text-xs text-gray-500'>
												{new Date(activity.timestamp).toLocaleDateString()}
											</p>
										</div>
										<div className='text-sm font-medium'>
											{formatCurrency(activity.amount, 'INR')}
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
