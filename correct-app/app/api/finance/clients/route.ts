import { NextRequest } from 'next/server';
import {
	getSecureResource,
	postSecureResource,
} from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';

function buildBackendPath(path: string, searchParams: URLSearchParams): string {
	const query = searchParams.toString();
	return query ? `${path}?${query}` : path;
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const path = buildBackendPath('/finance/clients', searchParams);
	const response = await getSecureResource(path);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data ?? { rows: [], count: 0 });
}

export async function POST(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const company = searchParams.get('company');
	if (!company || company === 'null') {
		return errorHandler(null, 'Please select a company before creating a client.', 400);
	}
	const body = await req.json();
	const path = buildBackendPath('/finance/clients', searchParams);
	const response = await postSecureResource(path, body);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data ?? body);
}

export const dynamic = 'force-dynamic';
