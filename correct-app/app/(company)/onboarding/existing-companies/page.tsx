'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/contexts/user';
import ExistingCompanies from '../_components/ExistingCompanies';
import { LoadingFallback } from '@/components/common/LoadingFallback';

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

export default function ExistingCompaniesPage() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading: isAuthLoading } = useUserAuth();

	const [companies, setCompanies] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (isAuthLoading) return;

		if (!isAuthenticated || !user) {
			router.push('/login');
			return;
		}

		const loadData = async () => {
			try {
				const data = await fetchAllCompaniesByUserId(user.id);
				setCompanies(data || []);
			} catch (error) {
				console.error('Failed to fetch companies:', error);
				setCompanies([]);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [user, isAuthenticated, isAuthLoading, router]);

	if (isAuthLoading || isLoading) {
		return <LoadingFallback />;
	}

	if (!companies || companies.length === 0) {
		return <div>No companies found</div>;
	}

	return <ExistingCompanies companies={companies} />;
}
