import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function GET(req: NextRequest) {
	return proxyToBackend('get', '/finance/recurring', req);
}

export async function POST(req: NextRequest) {
	return proxyToBackend('post', '/finance/recurring', req, {
		requireCompanyParam: true,
		actionName: 'creating a recurring profile',
	});
}

export const dynamic = 'force-dynamic';
