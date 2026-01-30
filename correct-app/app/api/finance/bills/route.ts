import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function GET(req: NextRequest) {
	return proxyToBackend('get', '/finance/bills', req);
}

export async function POST(req: NextRequest) {
	return proxyToBackend('post', '/finance/bills', req, {
		requireCompanyParam: true,
		actionName: 'creating a bill',
	});
}

export const dynamic = 'force-dynamic';
