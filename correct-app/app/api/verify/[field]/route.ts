import { NextResponse } from 'next/server';
import { PAN_REGEX, GSTIN_REGEX, CIN_REGEX } from '@/utils/constants/regex';
import { errorHandler } from '@/lib/errorHandler';

export async function POST(
	request: Request,
	props: { params: Promise<{ field: string }> }
) {
	const params = await props.params;
	try {
		const { field } = params;
		const body = await request.json();
		const value = body[field];

		switch (field) {
			case 'cin':
				if (CIN_REGEX.test(value)) {
					return NextResponse.json({ success: true });
				} else {
					return errorHandler(null, 'Invalid CIN', 400);
				}
			case 'pan':
				if (PAN_REGEX.test(value)) {
					return NextResponse.json({ success: true });
				} else {
					return errorHandler(null, 'Invalid PAN', 400);
				}
			case 'gst':
				if (GSTIN_REGEX.test(value)) {
					return NextResponse.json({ success: true });
				} else {
					return errorHandler(null, 'Invalid GSTIN', 400);
				}
		}
	} catch (error) {
		console.error('Unhandled error in POST handler:', error);
		return errorHandler(null, 'Internal Server Error', 500);
	}
}
