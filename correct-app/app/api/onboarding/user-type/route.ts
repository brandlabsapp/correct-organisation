import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	const { userType } = await request.json();

	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return NextResponse.json({ success: true });
}
