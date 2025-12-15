import { getSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export async function GET(
	req: Request,
	props: { params: Promise<{ conversationId: string }> }
) {
	const params = await props.params;
	try {
		const conversationId = params.conversationId;

		if (!conversationId) {
			return errorHandler(null, 'Conversation ID is required', 400);
		}

		const response = await getSecureResource(`/conversation/${conversationId}`);

		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}

		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in GET conversation handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
}
