import { jwtDecode } from 'jwt-decode';
import ExistingCompanies from '../_components/ExistingCompanies';
import { retrieveToken } from '@/lib/axiosInstance';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

const fetchAllCompaniesByUserId = async (userId: number) => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
	const companyUrl = `${baseUrl}/api/onboarding/existing-companies/${userId}`;

	const response = await fetch(companyUrl, {
		method: 'GET',
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json' },
	});

	const data = await response.json();

	if (!data) {
		return [];
	}
	return data?.data;
};

// ------------ Metadata ------------

export const metadata: Metadata = {
	title: 'Existing Companies',
	description: 'Existing Companies',
	keywords: [
		'Existing Companies',
		'Compliance',
		'Compliance Management',
		'Compliance Tracker',
	],
};

export default async function ExistingCompaniesPage() {
	const token = await retrieveToken();

	if (!token) {
		redirect('/login');
	}
	const user = jwtDecode<AppTypes.User>(token);

	if (!user) {
		redirect('/login');
	}

	const data = await fetchAllCompaniesByUserId(user.id);
	console.log(data, 'data');

	if (!data) {
		return <div>No companies found</div>;
	}

	return <ExistingCompanies companies={data} />;
}
