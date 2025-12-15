import { getSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const GET = async (req: Request, props: { params: Promise<{ companyId: string }> }) => {
    const params = await props.params;
    try {
		const companyId = params.companyId;
		const response = await getSecureResource(`/vault/folders/${companyId}`);
		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}
		return responseWrapper(
			response.data,
			true,
			'Folders fetched',
			response.state
		);
	} catch (error: any) {
		console.error('Unhandled error in GET handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
