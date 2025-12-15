import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';
import { patchSecureResource } from '@/lib/axiosInstance';

export async function PATCH(request: Request) {
	try {
		const data = await request.json();
		const response = await patchSecureResource(`/user/update`, {
			...data,
		});

		if (response.state !== 'success') {
			return errorHandler(response.data, response.message, response.status);
		}

		return responseWrapper(response.data, true, 'Success', 'success');
	} catch (error: any) {
		return errorHandler(null, 'Failed to send OTP', 500);
	}
}
