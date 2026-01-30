import { NextRequest } from 'next/server';
import {
	getSecureResource,
	putSecureResource,
	deleteSecureResource,
} from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';

function buildBackendPath(
	id: string,
	method: 'get' | 'put' | 'delete',
	searchParams: URLSearchParams
): string {
	const path = `/finance/clients/${id}`;
	const query = searchParams.toString();
	return query ? `${path}?${query}` : path;
}

export async function GET(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	const { searchParams } = new URL(req.url);
	const path = buildBackendPath(id, 'get', searchParams);
	const response = await getSecureResource(path);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data);
}

export async function PUT(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	const { searchParams } = new URL(req.url);
	const company = searchParams.get('company');
	if (!company || company === 'null') {
		return errorHandler(null, 'Please select a company.', 400);
	}
	const body = await req.json();
	const path = buildBackendPath(id, 'put', searchParams);
	const response = await putSecureResource(path, body);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data ?? body);
}

export async function DELETE(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	const { searchParams } = new URL(req.url);
	const path = buildBackendPath(id, 'delete', searchParams);
	const response = await deleteSecureResource(path);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data ?? {});
}

export const dynamic = 'force-dynamic';
