'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUserAuth } from '@/contexts/user';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface NavItem {
	href: string;
	selectedIcon: string;
	unselectedIcon: string;
	label: string;
	id: string;
}

const SIDEBAR_TITLE = 'Correct';
const SIDEBAR_SUBTITLE = 'Manage your workspace';

const navItems: NavItem[] = [
	{
		href: '/dashboard',
		selectedIcon: '/assets/icons/correct-selected.svg',
		unselectedIcon: '/assets/icons/correct.svg',
		label: 'Home',
		id: 'home',
	},
	{
		href: '/learn',
		selectedIcon: '/assets/icons/learn-selected.svg',
		unselectedIcon: '/assets/icons/learn.svg',
		label: 'Learn',
		id: 'learn',
	},
	{
		href: '/vault',
		selectedIcon: '/assets/icons/vault-selected.svg',
		unselectedIcon: '/assets/icons/vault.svg',
		label: 'Vault',
		id: 'vault',
	},
	{
		href: '/chat',
		selectedIcon: '/assets/icons/chat-selected.svg',
		unselectedIcon: '/assets/icons/chat.svg',
		label: 'Chat',
		id: 'chat',
	},
	{
		href: '/profile',
		selectedIcon: '/assets/icons/profile-selected.svg',
		unselectedIcon: '/assets/icons/profile.svg',
		label: 'Profile',
		id: 'profile',
	},
];

export function Sidebar() {
	const pathname = usePathname();
	const query = useSearchParams();
	const companyId = query.get('company');
	const { company } = useUserAuth();

	return (
		<aside
			className={cn(
				'left-0 top-14 z-40 min-h-screen w-64 bg-white border-r border-gray-200',
				'hidden md:flex flex-col'
			)}
		>
			<div className='border-b border-gray-200 p-4'>
				<h2 className='text-xl font-bold text-gray-900 leading-tight'>
					{SIDEBAR_TITLE}
				</h2>
				<p className='text-sm font-normal text-gray-600 mt-0.5'>
					{SIDEBAR_SUBTITLE}
				</p>
			</div>

			<nav className='flex-1 p-2'>
				<ul className='space-y-2'>
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						return (
							<li key={item.href}>
								<Link
									href={`${item.href}?company=${company?.uuid || companyId}`}
									className={cn(
										'flex items-center justify-start gap-3 rounded-full px-4 py-3 h-11 min-h-11 text-body3 font-medium transition-colors',
										isActive
											? 'bg-green-50 text-green-600'
											: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
									)}
								>
									<div
										id={item.id}
										className='flex items-center justify-center w-8 h-8 shrink-0'
									>
										<Image
											src={isActive ? item.selectedIcon : item.unselectedIcon}
											alt={item.label}
											width={20}
											height={20}
											className='w-6 h-6 object-contain'
										/>
									</div>
									<span className='truncate leading-none'>{item.label}</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
}
