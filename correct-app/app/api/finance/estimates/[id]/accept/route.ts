import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function POST(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	return proxyToBackend('post', `/finance/estimates/${id}/accept`, req, {
		requireCompanyParam: true,
		actionName: 'accepting estimate',
	});
}

export const dynamic = 'force-dynamic';
