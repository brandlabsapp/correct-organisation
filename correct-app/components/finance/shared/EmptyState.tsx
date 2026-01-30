'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
	FileText,
	Receipt,
	FileCheck,
	Users,
	BarChart3,
	Inbox,
	PlusCircle,
} from 'lucide-react';

type EmptyStateType =
	| 'invoices'
	| 'bills'
	| 'estimates'
	| 'clients'
	| 'reports'
	| 'activity'
	| 'generic';

interface EmptyStateProps {
	type: EmptyStateType;
	title?: string;
	description?: string;
	actionLabel?: string;
	actionHref?: string;
	onAction?: () => void;
	children?: ReactNode;
}

const emptyStateConfigs: Record<
	EmptyStateType,
	{
		icon: any;
		defaultTitle: string;
		defaultDescription: string;
		defaultActionLabel: string;
		bgColor: string;
		iconColor: string;
	}
> = {
	invoices: {
		icon: FileText,
		defaultTitle: 'No invoices yet',
		defaultDescription:
			'Create your first invoice to start tracking your income and getting paid faster.',
		defaultActionLabel: 'Create Invoice',
		bgColor: 'bg-blue-50',
		iconColor: 'text-blue-500',
	},
	bills: {
		icon: Receipt,
		defaultTitle: 'No bills recorded',
		defaultDescription:
			'Track your expenses by adding bills from vendors and suppliers.',
		defaultActionLabel: 'Add Bill',
		bgColor: 'bg-orange-50',
		iconColor: 'text-orange-500',
	},
	estimates: {
		icon: FileCheck,
		defaultTitle: 'No estimates created',
		defaultDescription:
			'Create estimates to quote your clients before converting them to invoices.',
		defaultActionLabel: 'Create Estimate',
		bgColor: 'bg-purple-50',
		iconColor: 'text-purple-500',
	},
	clients: {
		icon: Users,
		defaultTitle: 'No clients added',
		defaultDescription:
			'Add your first client to start creating invoices and managing relationships.',
		defaultActionLabel: 'Add Client',
		bgColor: 'bg-green-50',
		iconColor: 'text-green-500',
	},
	reports: {
		icon: BarChart3,
		defaultTitle: 'No data for reports',
		defaultDescription:
			'Once you start creating invoices and bills, your financial reports will appear here.',
		defaultActionLabel: 'Create Invoice',
		bgColor: 'bg-indigo-50',
		iconColor: 'text-indigo-500',
	},
	activity: {
		icon: Inbox,
		defaultTitle: 'No recent activity',
		defaultDescription:
			'Your recent financial activities will show up here once you start using the system.',
		defaultActionLabel: 'Get Started',
		bgColor: 'bg-gray-50',
		iconColor: 'text-gray-500',
	},
	generic: {
		icon: Inbox,
		defaultTitle: 'Nothing here yet',
		defaultDescription: 'Get started by creating your first item.',
		defaultActionLabel: 'Get Started',
		bgColor: 'bg-gray-50',
		iconColor: 'text-gray-500',
	},
};

export function EmptyState({
	type,
	title,
	description,
	actionLabel,
	actionHref,
	onAction,
	children,
}: EmptyStateProps) {
	const config = emptyStateConfigs[type];
	const Icon = config.icon;

	const displayTitle = title || config.defaultTitle;
	const displayDescription = description || config.defaultDescription;
	const displayActionLabel = actionLabel || config.defaultActionLabel;

	return (
		<div className='flex flex-col items-center justify-center py-16 px-4'>
			{/* Icon Container */}
			<div
				className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mb-6`}
			>
				<Icon className={`w-10 h-10 ${config.iconColor}`} />
			</div>

			{/* Content */}
			<h3 className='text-lg font-semibold text-gray-900 mb-2 text-center'>
				{displayTitle}
			</h3>
			<p className='text-gray-500 text-center max-w-md mb-6'>
				{displayDescription}
			</p>

			{/* Action Button */}
			{(actionHref || onAction) && (
				<>
					{actionHref ? (
						<Link href={actionHref}>
							<Button className='bg-green hover:bg-green/90'>
								<PlusCircle className='w-4 h-4 mr-2' />
								{displayActionLabel}
							</Button>
						</Link>
					) : (
						<Button className='bg-green hover:bg-green/90' onClick={onAction}>
							<PlusCircle className='w-4 h-4 mr-2' />
							{displayActionLabel}
						</Button>
					)}
				</>
			)}

			{/* Custom children */}
			{children}
		</div>
	);
}

// Loading skeleton for lists
export function ListSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div className='space-y-4 p-6'>
			{Array.from({ length: rows }).map((_, i) => (
				<div key={i} className='flex items-center gap-4 animate-pulse'>
					<div className='h-4 w-24 bg-gray-200 rounded' />
					<div className='h-4 w-32 bg-gray-200 rounded' />
					<div className='h-4 w-20 bg-gray-200 rounded' />
					<div className='h-4 w-16 bg-gray-200 rounded' />
					<div className='h-4 w-20 bg-gray-200 rounded ml-auto' />
				</div>
			))}
		</div>
	);
}

// Card skeleton for dashboard
export function CardSkeleton() {
	return (
		<div className='h-32 bg-white rounded-lg border p-6 animate-pulse'>
			<div className='flex justify-between'>
				<div className='space-y-3'>
					<div className='h-3 w-24 bg-gray-200 rounded' />
					<div className='h-6 w-32 bg-gray-200 rounded' />
				</div>
				<div className='h-12 w-12 bg-gray-200 rounded-full' />
			</div>
		</div>
	);
}
