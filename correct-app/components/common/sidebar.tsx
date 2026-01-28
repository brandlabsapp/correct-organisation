'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useUserAuth } from '@/contexts/user';
import { useSidebar } from '@/contexts/sidebar';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

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

export function Sidebar() {
	const pathname = usePathname();
	const query = useSearchParams();
	const companyId = query.get('company');
	const { company } = useUserAuth();
	const { isCollapsed, setIsCollapsed } = useSidebar();

	return (
		<aside
			className={cn(
				'left-0 top-14 z-40 min-h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
				'hidden md:flex flex-col',
				isCollapsed ? 'w-16' : 'w-64',
			)}
		>
			<div
				className={cn('flex p-4', isCollapsed ? 'justify-start' : 'justify-end')}
			>
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
					aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
				>
					{isCollapsed ? (
						<ChevronRight className='h-5 w-5 text-gray-600' />
					) : (
						<ChevronLeft className='h-5 w-5 text-gray-600' />
					)}
				</button>
			</div>

			{/* Navigation Items */}
			<nav className='flex-1 px-2 pb-4'>
				<TooltipProvider>
					<ul className='space-y-2'>
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<li key={item.href}>
									<Link
										href={`${item.href}?company=${company?.uuid || companyId}`}
										className={cn(
											'flex items-center p-6 rounded-full text-body3 font-medium transition-colors h-12',
											'hover:bg-gray-100',
											isCollapsed ? 'justify-center' : 'justify-start',
											isActive
												? 'bg-gray-100 text-black'
												: 'text-gray-600 hover:text-gray-900',
										)}
									>
										{isCollapsed ? (
											<Tooltip>
												<TooltipTrigger asChild>
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
												</TooltipTrigger>
												<TooltipContent side='right'>{item.label}</TooltipContent>
											</Tooltip>
										) : (
											<>
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
												<span className='ml-3 truncate leading-none'>{item.label}</span>
											</>
										)}
									</Link>
								</li>
							);
						})}
					</ul>
				</TooltipProvider>
			</nav>
		</aside>
	);
}
