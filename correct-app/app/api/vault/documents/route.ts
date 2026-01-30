import { postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const POST = async (req: Request) => {
	try {
		const data = await req.json();
		// Backend create-document expects multipart form fields (FilesInterceptor); send as FormData
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (value === null || value === undefined) return;
			if (Array.isArray(value)) {
				value.forEach((v) => formData.append(key, String(v)));
			} else {
				formData.append(key, String(value));
			}
		});
		// Do not set Content-Type: axios will set multipart/form-data with boundary
		const response = await postSecureResource(
			'/vault/create-document',
			formData,
			{}
		);
		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}
		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Unhandled error in POST handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
