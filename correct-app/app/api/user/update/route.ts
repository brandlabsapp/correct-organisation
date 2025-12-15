import { patchSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const PATCH = async (req: Request) => {
	const body = await req.json();
	try {
		const response = await patchSecureResource(`/user/update`, {
			...body,
		});
		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}
		return responseWrapper(
			response.data,
			true,
			'Folder updated successfully.',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in PATCH handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
