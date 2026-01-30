import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function GET(req: NextRequest) {
	return proxyToBackend('get', '/finance/estimates', req);
}

export async function POST(req: NextRequest) {
	return proxyToBackend('post', '/finance/estimates', req, {
		requireCompanyParam: true,
		actionName: 'creating an estimate',
	});
}

export const dynamic = 'force-dynamic';
