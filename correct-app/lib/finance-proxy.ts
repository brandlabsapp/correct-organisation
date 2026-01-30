import { NextRequest } from 'next/server';
import {
	getSecureResource,
	postSecureResource,
	putSecureResource,
	deleteSecureResource,
} from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';

export function buildBackendPath(path: string, searchParams: URLSearchParams): string {
	const query = searchParams.toString();
	return query ? `${path}?${query}` : path;
}

export function requireCompany(searchParams: URLSearchParams, action = 'this action'): Response | null {
	const company = searchParams.get('company');
	if (!company || company === 'null') {
		return errorHandler(null, `Please select a company for ${action}.`, 400);
	}
	return null;
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export async function proxyToBackend(
	method: HttpMethod,
	path: string,
	req: NextRequest,
	options?: { requireCompanyParam?: boolean; actionName?: string }
): Promise<Response> {
	const { searchParams } = new URL(req.url);
	if (options?.requireCompanyParam) {
		const err = requireCompany(searchParams, options.actionName ?? 'this action');
		if (err) return err;
	}
	const fullPath = buildBackendPath(path, searchParams);
	let response: { state: string; data?: any; message?: string; status?: number };
	if (method === 'get') {
		response = await getSecureResource(fullPath);
	} else if (method === 'post') {
		const body = req.method === 'POST' ? await req.json().catch(() => ({})) : undefined;
		response = await postSecureResource(fullPath, body ?? {});
	} else if (method === 'put') {
		const body = await req.json().catch(() => ({}));
		response = await putSecureResource(fullPath, body);
	} else {
		response = await deleteSecureResource(fullPath);
	}
	if (response.state === 'error') {
		return errorHandler(response.data, response.message ?? 'Request failed', response.status ?? 500);
	}
	const data = response.data ?? (method === 'delete' ? {} : null);
	return Response.json(data);
}
