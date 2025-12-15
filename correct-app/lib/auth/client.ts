// Client-side authentication helpers
// Use this in Client Components
'use client';

/**
 * Get authentication token from cookies (client-side)
 * Note: For same-origin requests, cookies are automatically sent with fetch
 * This is mainly for checking auth status, not for manual header management
 * 
 * @returns Authentication token or null if not found
 * 
 * @example
 * ```typescript
 * // In a Client Component
 * const token = getAuthToken();
 * if (!token) router.push('/login');
 * ```
 */
export function getAuthToken(): string | null {
	if (typeof window === 'undefined') return null;

	const name = 'Authentication';
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop()?.split(';').shift() || null;
	}
	return null;
}

/**
 * Check if user is authenticated (client-side)
 * 
 * @returns True if user has valid auth token
 * 
 * @example
 * ```typescript
 * // In a Client Component
 * const authenticated = isAuthenticated();
 * if (!authenticated) router.push('/login');
 * ```
 */
export function isAuthenticated(): boolean {
	return !!getAuthToken();
}

/**
 * Get company ID from cookies (client-side)
 * 
 * @returns Company ID or null if not found
 */
export function getCompanyId(): string | null {
	if (typeof window === 'undefined') return null;

	const name = 'companyId';
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop()?.split(';').shift() || null;
	}
	return null;
}
