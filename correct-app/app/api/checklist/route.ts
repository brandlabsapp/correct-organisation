import { postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const POST = async (req: Request) => {
	try {
		const body = await req.json();

		if (!body.companyId) {
			return errorHandler(null, 'Company ID is required', 400);
		}
		const payload = {
			...body,
			startDate: body.start,
			endDate: body.end,
			complianceIds: body.complianceIds ?? [],
		};
		const response = await postSecureResource('/admin/create-checklists', {
			...payload,
		});

		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}

		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in POST handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
