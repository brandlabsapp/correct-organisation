import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function GET(req: NextRequest) {
	return proxyToBackend('get', '/finance/settings/saved-items', req);
}

export async function POST(req: NextRequest) {
	return proxyToBackend('post', '/finance/settings/saved-items', req, {
		requireCompanyParam: true,
		actionName: 'creating a saved item',
	});
}

export const dynamic = 'force-dynamic';
