import { NextRequest } from 'next/server';
import { postSecureResource } from '@/lib/axiosInstance';
import { responseWrapper } from '@/lib/responseWrapper';
import { errorHandler } from '@/lib/errorHandler';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { data } = body;

		if (!data || !Array.isArray(data) || data.length === 0) {
			return errorHandler(null, 'No data provided for upload.', 400);
		}

		const apiResponse = await postSecureResource('/compliance/import-bulk', data);

		if (apiResponse.state === 'error') {
			return errorHandler(
				apiResponse.data,
				apiResponse.message,
				apiResponse.status
			);
		}

		return responseWrapper(
			apiResponse.data,
			true,
			'Data uploaded successfully',
			'success'
		);
	} catch (error: any) {
		return errorHandler(null, `Internal Server Error: ${error.message}`, 500);
	}
}
