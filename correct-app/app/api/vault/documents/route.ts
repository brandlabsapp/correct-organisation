import { postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const POST = async (req: Request) => {
	try {
		const data = await req.json();
		const headers = { 'Content-Type': 'multipart/form-data' };
		const response = await postSecureResource(
			'/vault/create-document',
			data,
			headers
		);
		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}
		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in POST handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
