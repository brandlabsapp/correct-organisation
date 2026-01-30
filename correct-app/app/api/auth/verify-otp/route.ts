import { postPublicResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const { phoneNumber, otp, token } = await request.json();

		const response = await postPublicResource('/auth/verify-otp', {
			phone: phoneNumber,
			otp,
			token,
		});

		if (response.data) {
			(await cookies()).set({
				name: 'Authentication',
				value: response.data.data.access_token,
				secure: true,
				httpOnly: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
			});
			(await cookies()).set({
				name: 'companyId',
				value: response.data.data.uuid,
				secure: true,
				httpOnly: true,
				sameSite: 'strict',
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
			});
		}

		if (response.state !== 'success') {
			console.error(`Failed to verify OTP:`, response);
			return errorHandler(null, response.message, response.status);
		}

		return responseWrapper(
			response.data.data,
			true,
			response.message,
			response.state,
		);
	} catch (error: any) {
		console.error('Error in Next.js API route:', error);
		return NextResponse.json(
			{
				success: false,
				message: 'Internal Server Error',
				error: error.message,
			},
			{ status: 500 },
		);
	}
}
