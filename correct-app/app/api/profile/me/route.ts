import { getSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export async function GET() {
	try {
		const response = await getSecureResource('/auth/profile');

		if (response.state !== 'success') {
			return errorHandler(response.data, response.message, response.status);
		}

		return responseWrapper(response.data, true, 'Authenticated', 'success');
	} catch (error: any) {
		return errorHandler(null, 'Failed to send OTP', 500);
	}
}
