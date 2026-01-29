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

export function BottomNav() {
	const pathname = usePathname();
	const query = useSearchParams();
	const companyId = query.get('company');
	const { company } = useUserAuth();

	return (
		<nav className='fixed bottom-0 left-0 right-0 z-50 max-w-full bg-white border-t md:hidden'>
			<div className='flex justify-between items-center h-16'>
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={`${item.href}?company=${company?.uuid || companyId}`}
						className={`flex flex-col items-center justify-center w-full h-full text-sm ${
							pathname === item.href ? 'text-black' : 'text-muted-foreground'
						}`}
					>
						<div
							id={item.id}
							className={cn('flex flex-col items-center justify-center w-12')}
						>
							<Image
								src={pathname === item.href ? item.selectedIcon : item.unselectedIcon}
								alt={item.label}
								width={60}
								height={60}
								className={cn('h-6 w-auto')}
							/>
							<span
								className={cn(
									'mt-1 text-xs text-secondarygray',
									pathname === item.href && 'text-black',
								)}
							>
								{item.label}
							</span>
						</div>
					</Link>
				))}
			</div>
		</nav>
	);
}
