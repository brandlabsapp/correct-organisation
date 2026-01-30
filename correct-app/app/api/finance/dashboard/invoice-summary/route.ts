import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/finance-proxy';

export async function GET(req: NextRequest) {
	return proxyToBackend('get', '/finance/dashboard/invoice-summary', req);
}

export const dynamic = 'force-dynamic';
