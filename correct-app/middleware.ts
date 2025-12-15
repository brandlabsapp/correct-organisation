// Next.js middleware for authentication and route protection
// Runs at the edge before page rendering
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/', '/login', '/privacy-policy', '/terms-and-conditions'];

// Authentication-related routes (login, verify, etc.)
const authRoutes = ['/login', '/verify'];

/**
 * Middleware function for authentication and route protection
 * 
 * Features:
 * - Redirects unauthenticated users to login
 * - Redirects authenticated users away from auth pages
 * - Runs at the edge for maximum performance
 * 
 * @param request - Incoming request
 * @returns Response (redirect or continue)
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const authToken = request.cookies.get('Authentication');
	const isPublicRoute = publicRoutes.includes(pathname);
	const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

	// Redirect authenticated users away from auth pages to dashboard
	if (authToken && isAuthRoute) {
		const companyId = request.cookies.get('companyId');
		return NextResponse.redirect(
			new URL(`/dashboard?company=${companyId?.value || ''}`, request.url)
		);
	}

	// Redirect unauthenticated users to login
	// (except for public routes and auth routes)
	if (!authToken && !isPublicRoute && !isAuthRoute) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// Continue to the requested page
	return NextResponse.next();
}

/**
 * Middleware configuration
 * Defines which routes the middleware should run on
 */
export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - api routes (handled separately in route handlers)
		 * - _next/static (static files)
		 * - _next/image (image optimization)
		 * - favicon.ico (favicon)
		 * - public folder files (assets, images, etc.)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|assets).*)',
	],
};
