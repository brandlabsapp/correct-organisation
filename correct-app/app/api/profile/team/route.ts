import { postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const POST = async (req: Request) => {
	try {
		const data = await req.json();
		const response = await postSecureResource('/company/invite-member', data);
		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}
		return responseWrapper(response.data, true, 'Success', 'success');
	} catch (error: any) {
		return errorHandler(null, 'Failed to send OTP', 500);
	}
};
