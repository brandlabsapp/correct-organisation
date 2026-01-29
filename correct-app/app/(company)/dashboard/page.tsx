'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Dashboard from './_components/Dashboard';
import { FetchFallback } from '@/components/common/FetchFallback';
import { DashboardSkeleton } from './_components/DashboardSkeleton';
import { SidebarLayout } from '@/components/common/sidebar-layout';

const fetchData = async (companyId: string) => {
	const baseUrl =
		process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
	const checkListUrl = `${baseUrl}/api/checklist/company/${companyId}`;

	const response = await fetch(checkListUrl, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
	});
	const { data } = await response.json();

	if (!data) {
		return [];
	}

	return data;
};

export default function DashboardPage() {
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [data, setData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!companyId) {
			setIsLoading(false);
			return;
		}

		const loadData = async () => {
			try {
				const result = await fetchData(companyId);
				setData(result);
			} catch (error) {
				console.error('Failed to fetch dashboard data:', error);
				setData([]);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [companyId]);

	if (!companyId) {
		console.error('No companyId provided');
		return null;
	}

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	if (data.length === 0) {
		return (
			<div className='min-h-screen bg-white'>
				<SidebarLayout>
					<FetchFallback
						title='In Review'
						description='Your business submission is in review please wait until your business is verified'
						subDescription='Until then, explore resources on how to keep your business compliant'
						titleClassName='text-center text-xl text-black'
					/>
				</SidebarLayout>
			</div>
		);
	}

	return <Dashboard data={data} companyId={companyId} />;
}
