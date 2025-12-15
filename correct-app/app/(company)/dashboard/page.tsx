import type { Metadata } from 'next';
import Dashboard from './_components/Dashboard';
import { FetchFallback } from '@/components/common/FetchFallback';
import { SidebarLayout } from '@/components/common/sidebar-layout';

//--------- functions to fetch data from the server
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

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Dashboard',
	keywords: [
		'Dashboard',
		'Compliance',
		'Compliance Management',
		'Compliance Tracker',
	],
};

export default async function DashboardPage(props: {
	searchParams: Promise<{ company: string }>;
}) {
	const searchParams = await props.searchParams;
	const companyId = searchParams.company;
	if (!companyId) {
		console.error('No companyId provided');
		return;
	}

	const data = await fetchData(companyId);

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
