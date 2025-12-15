import { postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const POST = async (req: Request) => {
	const formData = await req.formData();

	const response = await postSecureResource(
		'/compliance/create-with-documents',
		formData,
		{
			'Content-Type': 'multipart/form-data',
		}
	);

	if (response.state === 'error') {
		return errorHandler(null, response.message, 500);
	}
	return responseWrapper(
		response.data,
		true,
		'Compliance created successfully',
		response.state
	);
};

export const dynamic = 'force-dynamic';
