'use client';

import { SidebarLayout } from '@/components/common/sidebar-layout';

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SidebarLayout>
			<header className='sticky top-0 w-full'></header>
			<main className='flex-1 px-5 py-2 h-full overflow-y-scroll'>{children}</main>
		</SidebarLayout>
	);
}
