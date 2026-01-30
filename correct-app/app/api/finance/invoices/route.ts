import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function GET(req: NextRequest) {
	return proxyToBackend('get', '/finance/invoices', req);
}

export async function POST(req: NextRequest) {
	return proxyToBackend('post', '/finance/invoices', req, {
		requireCompanyParam: true,
		actionName: 'creating an invoice',
	});
}

export const dynamic = 'force-dynamic';
