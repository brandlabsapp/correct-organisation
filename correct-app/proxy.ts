import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = [
	'/',
	'/correct',
	'/ai-chat',
	'/financial-management',
	'/privacy-policy',
	'/terms-and-conditions',
];

export async function proxy(request: NextRequest) {
	const authToken = request.cookies.get('Authentication')?.value;
	const adminSession = request.cookies.get('admin_session')?.value;
	const requestHeaders = new Headers(request.headers);
	const { pathname } = request.nextUrl;

	const isPublicRoute = publicRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);

	if (isPublicRoute) {
		return NextResponse.next();
	}

	if (pathname.startsWith('/admin')) {
		if (pathname === '/admin/login') {
			if (adminSession) {
				return NextResponse.redirect(new URL('/admin/compliances', request.url));
			}
			return NextResponse.next();
		}

		if (!adminSession) {
			return NextResponse.redirect(new URL('/admin/login', request.url));
		}

		if (authToken) {
			requestHeaders.set('Authentication', `Bearer ${authToken}`);
		}
		return NextResponse.next({ headers: requestHeaders });
	}

	if (pathname.startsWith('/login')) {
		return NextResponse.next();
	}

	if (!authToken) {
		return NextResponse.redirect(new URL('/', request.url));
	}
	requestHeaders.set('Authentication', `Bearer ${authToken}`);
	return NextResponse.next({ headers: requestHeaders });
}

export const config = {
	matcher: [
		'/((?!api|_next/|favicon.ico|sitemap.xml|robots.txt|public|assets).*)',
	],
};
