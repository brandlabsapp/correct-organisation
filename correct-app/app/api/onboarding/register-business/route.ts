import { postPublicResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';
import { cookies } from 'next/headers';
export async function POST(request: Request) {
	try {
		const businessDetails = await request.json();
		const response = await postPublicResource(
			'/company/register',
			businessDetails
		);

		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}

		const companyId = response.data.id;

		(await cookies()).set({
			name: 'companyId',
			value: companyId,
			secure: true,
			httpOnly: true,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
		});

		return responseWrapper(
			response.data,
			true,
			'Business registered successfully',
			response.state
		);
	} catch (error) {
		console.error('Unhandled error in POST handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
}
