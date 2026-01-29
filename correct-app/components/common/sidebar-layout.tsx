'use client';

import { ReactNode } from 'react';
import { SidebarProvider, useSidebar } from '@/contexts/sidebar';
import { NavigationWrapper } from './navigation-wrapper';
import { cn } from '@/lib/utils';

interface SidebarLayoutProps {
	children: ReactNode;
}

function SidebarLayoutContent({ children }: SidebarLayoutProps) {
	return (
		<div className='flex h-[calc(100vh-3.7rem)] overflow-hidden bg-white'>
			<NavigationWrapper />
			<div
				className={cn(
					'flex-1 pb-16 md:pb-0 transition-all duration-300 ease-in-out',
				)}
			>
				{children}
			</div>
		</div>
	);
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
	return (
		<SidebarProvider>
			<SidebarLayoutContent>{children}</SidebarLayoutContent>
		</SidebarProvider>
	);
}
