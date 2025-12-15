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
			<>
				<Header />
				{children}
			</>
		);
	}

	if (isHomePage) {
		return <UserProvider>{children}</UserProvider>;
	}

	if (isAuthPage) {
		return (
			<>
				<Toaster />
				{children}
			</>
		);
	}

	return (
		<UserProvider>
			<AdminProvider>
				<Toaster />
				<Header />
				{children}
			</AdminProvider>
		</UserProvider>
	);
}
