'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/common/Header';
import { UserProvider } from '@/contexts/user';
import { AdminProvider } from '@/contexts/admin';

interface AuthLayoutWrapperProps {
	children: React.ReactNode;
}

type RouteVariant = 'home' | 'public' | 'auth' | 'app';

const PUBLIC_ROUTES = new Set(['/privacy-policy', '/terms-and-conditions']);

const getRouteVariant = (pathname: string): RouteVariant => {
	if (pathname === '/') return 'home';
	if (PUBLIC_ROUTES.has(pathname)) return 'public';
	if (pathname.startsWith('/auth') || pathname.startsWith('/login')) {
		return 'auth';
	}
	return 'app';
};

export function AuthLayoutWrapper({ children }: AuthLayoutWrapperProps) {
	const pathname = usePathname();

	const routeVariant = getRouteVariant(pathname);

	if (routeVariant === 'home') {
		return <UserProvider>{children}</UserProvider>;
	}

	if (routeVariant === 'public') {
		return (
			<UserProvider>
				<Header />
				{children}
			</UserProvider>
		);
	}

	if (routeVariant === 'auth') {
		return (
			<UserProvider>
				<Toaster />
				{children}
			</UserProvider>
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
