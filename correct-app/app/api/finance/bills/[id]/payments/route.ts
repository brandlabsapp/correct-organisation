import { NextRequest } from 'next/server';
import { getSecureResource, postSecureResource } from '@/lib/axiosInstance';
import { buildBackendPath, requireCompany } from '@/lib/finance-proxy';
import { errorHandler } from '@/lib/errorHandler';

export async function GET(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	const { searchParams } = new URL(req.url);
	const path = buildBackendPath(`/finance/bills/${id}/payments`, searchParams);
	const response = await getSecureResource(path);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data ?? []);
}

export async function POST(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	const { searchParams } = new URL(req.url);
	const err = requireCompany(searchParams, 'recording a bill payment');
	if (err) return err;
	const body = await req.json();
	const path = buildBackendPath(`/finance/bills/${id}/payments`, searchParams);
	const response = await postSecureResource(path, body);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data ?? body);
}

export const dynamic = 'force-dynamic';
