import { getSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';
import { NextRequest } from 'next/server';

export const GET = async (
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) => {
	const params = await props.params;
	try {
		const id = params.id;
		const response = await getSecureResource(`/vault/get-presigned-url/${id}`);
		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}
		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in GET handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
