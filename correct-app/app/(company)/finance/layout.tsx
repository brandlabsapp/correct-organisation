'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
	LayoutDashboard,
	FileText,
	Receipt,
	FileCheck,
	Users,
	Settings,
	BarChart3,
	RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
	{
		label: 'Dashboard',
		href: '/finance',
		icon: LayoutDashboard,
	},
	{
		label: 'Invoices',
		href: '/finance/invoices',
		icon: FileText,
	},
	{
		label: 'Recurring',
		href: '/finance/recurring',
		icon: RefreshCw,
	},
	{
		label: 'Bills',
		href: '/finance/bills',
		icon: Receipt,
	},
	{
		label: 'Estimates',
		href: '/finance/estimates',
		icon: FileCheck,
	},
	{
		label: 'Clients',
		href: '/finance/clients',
		icon: Users,
	},
	{
		label: 'Reports',
		href: '/finance/reports',
		icon: BarChart3,
	},
	{
		label: 'Settings',
		href: '/finance/settings',
		icon: Settings,
	},
];

export default function FinanceLayout({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const buildHref = (href: string) => {
		return companyId ? `${href}?company=${companyId}` : href;
	};

	const isActive = (href: string) => {
		if (href === '/finance') {
			return pathname === '/finance';
		}
		return pathname.startsWith(href);
	};

	return (
		<div className='flex min-h-screen bg-gray-50'>
			{/* Sidebar */}
			<aside className='hidden md:flex w-64 flex-col bg-white border-r border-gray-200'>
				<div className='p-6 border-b border-gray-200'>
					<h1 className='text-xl font-bold text-gray-900'>Finance</h1>
					<p className='text-sm text-gray-500'>Manage your finances</p>
				</div>
				<nav className='flex-1 p-4 space-y-1'>
					{sidebarItems.map((item) => {
						const Icon = item.icon;
						const active = isActive(item.href);
						return (
							<Link
								key={item.href}
								href={buildHref(item.href)}
								className={cn(
									'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
									active
										? 'bg-green/10 text-green'
										: 'text-gray-600 hover:bg-gray-100'
								)}
							>
								<Icon className='h-5 w-5' />
								{item.label}
							</Link>
						);
					})}
				</nav>
			</aside>

			{/* Mobile Bottom Nav */}
			<nav className='md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200'>
				<div className='flex justify-around py-2'>
					{sidebarItems.slice(0, 5).map((item) => {
						const Icon = item.icon;
						const active = isActive(item.href);
						return (
							<Link
								key={item.href}
								href={buildHref(item.href)}
								className={cn(
									'flex flex-col items-center gap-1 px-3 py-2 text-xs',
									active ? 'text-green' : 'text-gray-500'
								)}
							>
								<Icon className='h-5 w-5' />
								{item.label}
							</Link>
						);
					})}
				</div>
			</nav>

			{/* Main Content */}
			<main className='flex-1 overflow-auto pb-20 md:pb-0'>{children}</main>
		</div>
	);
}
