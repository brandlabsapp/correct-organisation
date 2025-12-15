'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function clearCookies(name: string) {
	const cookieStore = await cookies();
	await cookieStore.delete(name);
}
