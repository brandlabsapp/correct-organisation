import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function POST(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	return proxyToBackend('post', `/finance/bills/${id}/mark-paid`, req, {
		requireCompanyParam: true,
		actionName: 'marking bill as paid',
	});
}

export const dynamic = 'force-dynamic';
