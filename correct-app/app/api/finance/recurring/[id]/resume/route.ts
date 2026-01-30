import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function POST(
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	const { id } = await props.params;
	return proxyToBackend('post', `/finance/recurring/${id}/resume`, req, {
		requireCompanyParam: true,
		actionName: 'resuming recurring profile',
	});
}

export const dynamic = 'force-dynamic';
