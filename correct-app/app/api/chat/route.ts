import { postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const POST = async (req: Request) => {
	try {
		const { messages, data } = await req.json();
		console.log('data from chat route', data);

		const payload = {
			messages: messages,
			userId: data.userId,
			companyId: data.companyId,
			conversationId: data.conversationId,
		};

		const response = await postSecureResource('/conversation', { ...payload });

		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}

		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in POST handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
