import { getSecureResource, postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const POST = async (req: Request) => {
	try {
		const data = await req.json();
		const response = await postSecureResource('/vault/create-folder', data);
		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}
		return responseWrapper(
			response.data,
			true,
			'Folder created successfully.',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in POST handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};

export const GET = async (req: Request) => {
	try {
		const response = await getSecureResource('/vault/folders/all');
		if (response.state === 'error') {
			return errorHandler('', response.message, response.status);
		}
		return responseWrapper(
			response.data,
			true,
			'Folders fetched',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in GET handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
