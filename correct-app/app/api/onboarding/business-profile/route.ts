import { patchPublicResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const PATCH = async (request: Request) => {
	try {
		const businessData = await request.json();

		const response = await patchPublicResource(
			`/company/${businessData.id}`,
			businessData
		);

		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}

		return responseWrapper(
			response.data,
			true,
			'Business profile updated successfully',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in PATCH handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
