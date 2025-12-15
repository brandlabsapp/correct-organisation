import { NextResponse } from 'next/server';

export const errorHandler = (
	data: any = null,
	message: string = 'An unexpected error occurred',
	status: number = 500
) => {
	return NextResponse.json(
		{
			success: false,
			message,
			data,
			statusCode: status,
		},
		{ status }
	);
};
