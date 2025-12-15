import { getSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export const GET = async (req: Request) => {
	try {
		const companies = await getSecureResource('/company/all-companies');

		if (companies.state === 'error') {
			console.error('Error fetching companies:', companies.message);
			return errorHandler(null, companies.message, companies.status);
		}

		return responseWrapper(
			companies.data,
			true,
			'Companies fetched successfully',
			'success'
		);
	} catch (error) {
		console.error('Unhandled error in GET handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
};
