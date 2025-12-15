import { postPublicResource } from '@/lib/axiosInstance';
import { errorHandler } from '@/lib/errorHandler';
import { responseWrapper } from '@/lib/responseWrapper';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
	const { phone, password } = await req.json();

	const response = await postPublicResource('/admin/login', {
		phone,
		password,
	});

	const data = response.data;

	if (data) {
		console.log(response.data, 'response.data');
		(await cookies()).set({
			name: 'admin_session',
			value: data.token,
			secure: true,
			httpOnly: true,
			expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
		});
	}

	if (response.state === 'error') {
		return errorHandler(null, response.message, response.status);
	}

	return responseWrapper(
		response.data,
		true,
		'Login successful',
		response.state
	);
};
