import { postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export async function POST(request: Request) {
	const data = await request.json();
	const response = await postSecureResource('/company/verify-role', data);

	if (response.state === 'error') {
		return errorHandler(null, response.message, response.status);
	}

	return responseWrapper(
		response.data,
		true,
		'Role verification submitted successfully',
		response.state
	);
}
