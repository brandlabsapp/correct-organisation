import { getSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export async function GET(
    req: Request,
    props: { params: Promise<{ userId: string; companyId: string }> }
) {
    const params = await props.params;
    try {
		const userId = params.userId;
		const companyId = params.companyId;
		const response = await getSecureResource(
			`/conversation/user-company/${userId}/${companyId}`
		);
		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}

		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in GET handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
}
