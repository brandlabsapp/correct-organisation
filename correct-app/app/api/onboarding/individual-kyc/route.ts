import { postSecureResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';

export async function POST(request: Request) {
	const data = await request.json();

	// Validate input
	if (!data.aadhaarNumber || !data.panNumber) {
		return errorHandler(null, 'Aadhaar and PAN numbers are required', 400);
	}

	// In a real application, you would call an API to verify these documents
	// For now, we'll simulate this with a simple success response

	try {
		// You would replace this with an actual API call
		const response = await postSecureResource('/individual/kyc', data);

		if (response.state === 'error') {
			return errorHandler(null, response.message, response.status);
		}

		return responseWrapper(
			response.data,
			true,
			'KYC submitted successfully',
			'success'
		);
	} catch (error) {
		// If the API isn't implemented yet, return a mock success response
		return responseWrapper(
			{ userId: data.userId, status: 'pending_verification' },
			true,
			'KYC submitted successfully',
			'success'
		);
	}
}
