import { NextRequest, NextResponse } from 'next/server';
import { postSecureResource } from '@/lib/axiosInstance';
import { responseWrapper } from '@/lib/responseWrapper';
import { errorHandler } from '@/lib/errorHandler';

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData();
		console.log('FormData received', formData);

		const response = await postSecureResource('/document/upload', formData, {
			'Content-Type': 'multipart/form-data',
		});
		if (response.state === 'error') {
			return errorHandler(response.data, response.message, response.status);
		}
		return responseWrapper(response.data, true, response.message, response.state);
	} catch (error) {
		console.error('Error uploading document:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
