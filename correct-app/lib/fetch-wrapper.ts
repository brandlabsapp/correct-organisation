// Custom fetch wrapper with automatic authorization
// This replaces axios and provides the same convenience with better Next.js integration

/**
 * Extended fetch options with auth support
 */
interface FetchOptions extends RequestInit {
	/** Whether this request requires authentication */
	requireAuth?: boolean;
	/** Base URL for API requests (defaults to NEXT_PUBLIC_API_URL) */
	baseURL?: string;
}

/**
 * Standardized API response format
 */
interface ApiResponse<T = any> {
	/** Response data (null on error) */
	data: T | null;
	/** Response message */
	message: string;
	/** Success status */
	success: boolean;
	/** HTTP status code */
	status: number;
}

/**
 * Enhanced fetch wrapper with automatic authorization
 * This replaces axios interceptors functionality
 * 
 * Features:
 * - Automatic auth header injection (server-side)
 * - Cookie-based auth (client-side)
 * - Consistent error handling
 * - TypeScript support
 * - Works in both Server and Client Components
 * 
 * @param url - Request URL (relative or absolute)
 * @param options - Fetch options with auth support
 * @returns Standardized API response
 * 
 * @example
 * ```typescript
 * // Client Component
 * const response = await fetchWithAuth('/api/profile', { requireAuth: true });
 * if (response.success) {
 *   console.log(response.data);
 * }
 * ```
 */
export async function fetchWithAuth<T = any>(
	url: string,
	options: FetchOptions = {}
): Promise<ApiResponse<T>> {
	const {
		requireAuth = false,
		baseURL = process.env.NEXT_PUBLIC_API_URL || '',
		headers = {},
		...restOptions
	} = options;

	try {
		// Build full URL
		const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

		// Prepare headers
		const requestHeaders: HeadersInit = {
			'Content-Type': 'application/json',
			...headers,
		};

		// For server-side calls requiring auth, inject auth headers
		if (requireAuth && typeof window === 'undefined') {
			try {
				const { getAuthHeaders } = await import('./auth/server');
				const authHeaders = await getAuthHeaders();
				Object.assign(requestHeaders, authHeaders);
			} catch (error) {
				// Auth token missing on server
				return {
					data: null,
					message: 'Authentication required',
					success: false,
					status: 401,
				};
			}
		}

		// For client-side calls, cookies are automatically sent with credentials: 'include'
		// No need to manually add auth header for same-origin requests

		// Make request
		const response = await fetch(fullUrl, {
			...restOptions,
			headers: requestHeaders,
			credentials: 'include', // Important: sends cookies automatically
		});

		// Parse response
		let data = null;
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json')) {
			data = await response.json().catch(() => null);
		}

		if (!response.ok) {
			return {
				data: null,
				message:
					data?.message || `HTTP ${response.status}: ${response.statusText}`,
				success: false,
				status: response.status,
			};
		}

		return {
			data: data,
			message: data?.message || 'Success',
			success: true,
			status: response.status,
		};
	} catch (error: any) {
		console.error('Fetch error:', error);
		return {
			data: null,
			message: error.message || 'Network error',
			success: false,
			status: 500,
		};
	}
}

/**
 * Convenience API methods (same API as axios)
 * Use these for cleaner code
 * 
 * @example
 * ```typescript
 * // GET request
 * const users = await api.get('/api/users');
 * 
 * // POST request
 * const newUser = await api.post('/api/users', { name: 'John' });
 * 
 * // With auth
 * const profile = await api.get('/api/profile', { requireAuth: true });
 * ```
 */
export const api = {
	/**
	 * GET request
	 */
	get: <T = any>(url: string, options?: FetchOptions) =>
		fetchWithAuth<T>(url, { ...options, method: 'GET' }),

	/**
	 * POST request
	 */
	post: <T = any>(url: string, data?: any, options?: FetchOptions) =>
		fetchWithAuth<T>(url, {
			...options,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined,
		}),

	/**
	 * PUT request
	 */
	put: <T = any>(url: string, data?: any, options?: FetchOptions) =>
		fetchWithAuth<T>(url, {
			...options,
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined,
		}),

	/**
	 * PATCH request
	 */
	patch: <T = any>(url: string, data?: any, options?: FetchOptions) =>
		fetchWithAuth<T>(url, {
			...options,
			method: 'PATCH',
			body: data ? JSON.stringify(data) : undefined,
		}),

	/**
	 * DELETE request
	 */
	delete: <T = any>(url: string, options?: FetchOptions) =>
		fetchWithAuth<T>(url, { ...options, method: 'DELETE' }),
};
