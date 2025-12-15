import { getSecureResource, postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';
import { NextRequest } from 'next/server';

export const POST = async (req: Request) => {
	try {
		const data = await req.json();

		const response = await postSecureResource('/vault/generate-presigned-url', {
			...data,
		});
		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}
		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in POST handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
