import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function POST(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	return proxyToBackend('post', `/finance/invoices/${id}/mark-paid`, req, {
		requireCompanyParam: true,
		actionName: 'marking invoice as paid',
	});
}

export const dynamic = 'force-dynamic';
