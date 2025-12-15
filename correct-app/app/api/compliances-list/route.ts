import { getSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
	try {
		const response = await getSecureResource('/compliance/list');

		if (response.state === 'error') {
			return errorHandler(null, response.message, 500);
		}
		return responseWrapper(
			response.data,
			true,
			'Compliances fetched successfully',
			response.state
		);
	} catch (error) {
		console.error('Error fetching or saving data:', error);
		return NextResponse.json(
			{ error: 'Failed to fetch or save data' },
			{ status: 500 }
		);
	}
};
export const dynamic = 'force-dynamic';
