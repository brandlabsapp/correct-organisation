import { responseWrapper } from '@/lib/responseWrapper';
import { getPublicResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';

export const GET = async (req: Request, props: { params: Promise<{ companyId: string }> }) => {
    const params = await props.params;
    try {
		const companyId = params.companyId;
		const response = await getPublicResource(`/admin/company/${companyId}`);
		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}
		return await responseWrapper(response.data, true, 'Success', 'success');
	} catch (error) {
		console.error('Unhandled error in GET handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
