import { postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const POST = async (req: Request) => {
	try {
		const { userId, companyId } = await req.json();

		if (!userId || !companyId) {
			return errorHandler(null, 'User ID and Company ID are required', 400);
		}

		const payload = {
			userId,
			companyId,
		};

		const response = await postSecureResource('/conversation/new', payload);

		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}

		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in POST new conversation handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
