import { NextRequest } from 'next/server';
import {
	getSecureResource,
	putSecureResource,
} from '@/lib/axiosInstance';
import { buildBackendPath, requireCompany } from '@/lib/finance-proxy';
import { errorHandler } from '@/lib/errorHandler';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const path = buildBackendPath('/finance/settings', searchParams);
	const response = await getSecureResource(path);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data);
}

export async function PUT(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const err = requireCompany(searchParams, 'updating finance settings');
	if (err) return err;
	const body = await req.json();
	const path = buildBackendPath('/finance/settings', searchParams);
	const response = await putSecureResource(path, body);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data ?? body);
}

export const dynamic = 'force-dynamic';
