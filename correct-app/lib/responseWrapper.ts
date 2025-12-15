import { NextResponse } from 'next/server';

export const responseWrapper = (
	data: any,
	success: boolean,
	message: string,
	state: string | undefined
) => {
	return NextResponse.json({
		data,
		success: success || false,
		message: message || 'An error occurred',
		state: state || 'error',
	});
};
