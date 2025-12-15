import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import HomePage from '@/components/home/HomePage';

export default async function LandingPage() {
	const cookieStore = await cookies();
	const authToken = cookieStore.get('Authentication');
	const companyId = cookieStore.get('companyId');

	if (authToken && companyId) {
		redirect('/dashboard?company=' + companyId.value);
	}

	return <HomePage />;
}
