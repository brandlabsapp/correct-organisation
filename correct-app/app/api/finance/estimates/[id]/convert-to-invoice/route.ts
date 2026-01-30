import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function POST(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	return proxyToBackend('post', `/finance/estimates/${id}/convert-to-invoice`, req, {
		requireCompanyParam: true,
		actionName: 'converting estimate to invoice',
	});
}

export const dynamic = 'force-dynamic';
