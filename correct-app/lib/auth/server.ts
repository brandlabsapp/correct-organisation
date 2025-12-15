// Server-side authentication helpers for Next.js 16
// Use this in Server Components and Route Handlers
import { cookies } from 'next/headers';

/**
 * Get authentication token from cookies (server-side only)
 * Used in Server Components and Route Handlers
 * 
 * @returns Authentication token or null if not found
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * const token = await getAuthToken();
 * if (!token) redirect('/login');
 * ```
 */
export async function getAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get('Authentication')?.value || null;
}

/**
 * Get auth headers for server-side API calls
 * Automatically includes authentication token from cookies
 * 
 * @throws {Error} If authentication token is missing
 * @returns Headers object with authentication cookie
 * 
 * @example
 * ```typescript
 * // In a Server Component or Route Handler
 * const headers = await getAuthHeaders();
 * const response = await fetch(`${process.env.API_URL}/api/data`, { headers });
 * ```
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
	const token = await getAuthToken();
	if (!token) {
		throw new Error('Authentication token is missing');
	}
	return {
		cookie: `Authentication=${token}`,
		'Content-Type': 'application/json',
	};
}

/**
 * Check if user is authenticated (server-side)
 * 
 * @returns True if user has valid auth token
 * 
 * @example
 * ```typescript
 * // In a Server Component
 * const authenticated = await isAuthenticated();
 * if (!authenticated) redirect('/login');
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
	const token = await getAuthToken();
	return !!token;
}

/**
 * Get company ID from cookies (server-side)
 * 
 * @returns Company ID or null if not found
 */
export async function getCompanyId(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get('companyId')?.value || null;
}
