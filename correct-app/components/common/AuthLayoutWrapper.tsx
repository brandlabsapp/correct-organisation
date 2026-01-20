'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/Header';
import { UserProvider } from '@/contexts/user';
import { AdminProvider } from '@/contexts/admin';
import { EventsProvider } from '@/contexts/event';

interface AuthLayoutWrapperProps {
	children: React.ReactNode;
}

const publicRoutes = ['/privacy-policy', '/terms-and-conditions'];

export function AuthLayoutWrapper({ children }: AuthLayoutWrapperProps) {
	const pathname = usePathname();
	const isPublicRoute = publicRoutes.includes(pathname);
	const isHomePage = pathname === '/';
	const isAuthPage =
		pathname.startsWith('/auth') || pathname.startsWith('/login');

	if (isPublicRoute) {
		return (
			<UserProvider>
				<Header />
				{children}
			</UserProvider>
		);
	}

	return (
		<UserProvider>
			{isAuthPage ? (
				<>
					<Toaster />
					{children}
				</>
			) : (
				<AdminProvider>
					<Toaster />
					<Header />
					{children}
				</AdminProvider>
			)}
		</UserProvider>
	);
}
