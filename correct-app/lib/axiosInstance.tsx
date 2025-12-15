import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:8000/api/v1';

interface ApiResponse {
	data: any;
	message: string;
	state?: 'success' | 'error';
	status?: number;
	response?: AxiosResponse | undefined;
}

export const retrieveToken = async (): Promise<string | null> => {
	try {
		if (typeof window === 'undefined') {
			const { cookies } = await import('next/headers');
			const cookieStore = await cookies();
			return cookieStore.get('Authentication')?.value || null;
		} else {
			const name = 'Authentication';
			const value = `; ${document.cookie}`;
			const parts = value.split(`; ${name}=`);
			if (parts.length === 2) {
				return parts.pop()?.split(';').shift() || null;
			}
			return null;
		}
	} catch (error) {
		console.error('Error retrieving token:', error);
		return null;
	}
};

const getAuthHeaders = async (): Promise<Record<string, any>> => {
	const token = await retrieveToken();
	if (!token) {
		return {
			data: null,
			message: 'Authentication token is missing',
			state: 'error',
			status: 401,
		};
	}
	return { cookie: `Authentication=${token}` };
};

const makeRequest = async <T,>(
	method: 'get' | 'post' | 'put' | 'patch' | 'delete',
	path: string,
	data: any = null,
	headers: Record<string, string> = {},
	secure: boolean = false
): Promise<ApiResponse> => {
	try {
		const authHeaders = secure ? await getAuthHeaders() : {};
		const config: AxiosRequestConfig = {
			method,
			url: `${SERVER_URL}${path}`,
			data,
			headers: { ...headers, ...authHeaders },
			withCredentials: true,
		};

		const response: AxiosResponse<T> = await axios(config);
		return {
			data: response.data,
			message: 'Request successful',
			state: 'success',
			status: response.status || 200,
		};
	} catch (error: any) {
		console.error(
			`Error in ${method.toUpperCase()} request:`,
			error.response?.data || error.message
		);
		const responseData = error.response?.data;
		const isAuthError = error.message === 'Authentication token is missing';
		return {
			data: null,
			message: isAuthError
				? error.message
				: responseData?.message || error.message || 'Internal Server Error',
			state: 'error',
			status: isAuthError
				? 401
				: error.response?.status || responseData?.statusCode || 500,
		};
	}
};

//------------------Public API Requests------------------
export const getPublicResource = (
	path: string,
	headers: Record<string, string> = {}
): Promise<ApiResponse> => makeRequest<ApiResponse>('get', path, null, headers);
export const postPublicResource = (
	path: string,
	data: any,
	headers: Record<string, string> = {}
): Promise<ApiResponse> =>
	makeRequest<ApiResponse>('post', path, data, headers);
export const putPublicResource = (
	path: string,
	data: any,
	headers: Record<string, string> = {}
): Promise<ApiResponse> => makeRequest<ApiResponse>('put', path, data, headers);
export const patchPublicResource = (
	path: string,
	data: any,
	headers: Record<string, string> = {}
): Promise<ApiResponse> =>
	makeRequest<ApiResponse>('patch', path, data, headers);
export const deletePublicResource = (
	path: string,
	headers: Record<string, string> = {}
): Promise<ApiResponse> =>
	makeRequest<ApiResponse>('delete', path, null, headers);

// ------------------Authenticated API Requests------------------
export const getSecureResource = (
	path: string,
	headers: Record<string, string> = {}
): Promise<ApiResponse> =>
	makeRequest<ApiResponse>('get', path, null, headers, true);

export const postSecureResource = (
	path: string,
	data: any,
	headers: Record<string, string> = {}
): Promise<ApiResponse> =>
	makeRequest<ApiResponse>('post', path, data, headers, true);
export const putSecureResource = (
	path: string,
	data: any,
	headers: Record<string, string> = {}
): Promise<ApiResponse> =>
	makeRequest<ApiResponse>('put', path, data, headers, true);
export const patchSecureResource = (
	path: string,
	data: any,
	headers: Record<string, string> = {}
): Promise<ApiResponse> =>
	makeRequest<ApiResponse>('patch', path, data, headers, true);
export const deleteSecureResource = (
	path: string,
	headers: Record<string, string> = {}
): Promise<ApiResponse> =>
	makeRequest<ApiResponse>('delete', path, null, headers, true);
