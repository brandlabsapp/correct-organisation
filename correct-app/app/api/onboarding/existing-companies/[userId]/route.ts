import { getPublicResource, patchPublicResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const GET = async (req: Request, props: { params: Promise<{ userId: string }> }) => {
    const params = await props.params;
    try {
		const userId = params.userId;

		const response = await getPublicResource(
			`/company-members/existing/${userId}`
		);
		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}
		return responseWrapper(
			response.data,
			true,
			'Company fetched',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in GET handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};

export const PATCH = async (req: Request, props: { params: Promise<{ userId: string }> }) => {
    const params = await props.params;
    try {
		const userId = params.userId;

		const body = await req.json();

		const response = await patchPublicResource(
			`/company-members/update/${userId}`,
			{ ...body }
		);
		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}
		return responseWrapper(
			response.data,
			true,
			'Company fetched',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in PATCH handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
