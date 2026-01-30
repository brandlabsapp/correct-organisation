import { NextRequest } from 'next/server';
import {
	putSecureResource,
	deleteSecureResource,
} from '@/lib/axiosInstance';
import { buildBackendPath, requireCompany } from '@/lib/finance-proxy';
import { errorHandler } from '@/lib/errorHandler';

export async function PUT(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	const { searchParams } = new URL(req.url);
	const err = requireCompany(searchParams, 'updating tax rate');
	if (err) return err;
	const body = await req.json();
	const path = buildBackendPath(`/finance/settings/tax-rates/${id}`, searchParams);
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
	const path = buildBackendPath(`/finance/settings/tax-rates/${id}`, searchParams);
	const response = await deleteSecureResource(path);
	if (response.state === 'error') {
		return errorHandler(response.data, response.message, response.status ?? 500);
	}
	return Response.json(response.data ?? {});
}

export const dynamic = 'force-dynamic';
