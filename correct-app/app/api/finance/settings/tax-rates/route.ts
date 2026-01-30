import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function GET(req: NextRequest) {
	return proxyToBackend('get', '/finance/settings/tax-rates', req);
}

export async function POST(req: NextRequest) {
	return proxyToBackend('post', '/finance/settings/tax-rates', req, {
		requireCompanyParam: true,
		actionName: 'creating a tax rate',
	});
}

export const dynamic = 'force-dynamic';
