import { NextResponse } from 'next/server';
import { putSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';

export const PUT = async (req: Request) => {
	const { data } = await req.json();
	try {
		const response = await putSecureResource('/company', {
			...data,
		});
		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}
		return NextResponse.redirect('/profile');
	} catch (error) {
		console.error('Unhandled error in PUT handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
export const dynamic = 'force-dynamic';
