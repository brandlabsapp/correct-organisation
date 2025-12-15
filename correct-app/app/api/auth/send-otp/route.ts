import { NextResponse } from 'next/server';
import { postPublicResource } from '@/lib/axiosInstance';
import { responseWrapper } from '@/lib/responseWrapper';

export async function POST(request: Request) {
	try {
		const { phoneNumber } = await request.json();

		console.log(phoneNumber);

		const response = await postPublicResource('/auth/login', {
			phone: phoneNumber,
		});

		if (response.state !== 'success') {
			return NextResponse.json(
				responseWrapper(response.data, true, response.message, response.state),
				{ status: response.status }
			);
		}

		return responseWrapper(response.data, true, 'OTP sent', response.state);
	} catch (error: any) {
		return NextResponse.json({
			success: false,
			message: 'Failed to send OTP',
			error: error.message,
		});
	}
}
