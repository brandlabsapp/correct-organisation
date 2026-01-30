'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarLayout } from '@/components/common/sidebar-layout';
import { ChecklistCard } from '@/components/checklist/checklist-card';
import { AllCompliancesSkeleton } from './_components/AllCompliancesSkeleton';

interface ComplianceItem {
	id: string;
	title: string;
	type: string;
	timeframe: string;
	status: string;
	compliance: {
		id: number;
		title: string;
		category: string;
		dueDateRule: string;
	};
}

const fetchData = async (
	companyId: string
): Promise<{ ongoing: ComplianceItem[]; completed: ComplianceItem[] }> => {
	const baseUrl =
		process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
	const checkListUrl = `${baseUrl}/api/checklist/company/${companyId}`;

	try {
		const response = await fetch(checkListUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		if (!response.ok) {
			console.error('Failed to fetch data');
			return { ongoing: [], completed: [] };
		}

		const { data } = await response.json();

		if (!data) {
			return { ongoing: [], completed: [] };
		}

		const ongoing = data.filter(
			(item: ComplianceItem) => item.status !== 'completed'
		);
		const completed = data.filter(
			(item: ComplianceItem) => item.status === 'completed'
		);

		return { ongoing, completed };
	} catch (error) {
		console.error('Error fetching data:', error);
		return { ongoing: [], completed: [] };
	}
};

export default function AllCompliances() {
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [ongoingComplianceItems, setOngoingComplianceItems] = useState<ComplianceItem[]>([]);
	const [completedComplianceItems, setCompletedComplianceItems] = useState<ComplianceItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!companyId) {
			setIsLoading(false);
			return;
		}

		const loadData = async () => {
			try {
				const { ongoing, completed } = await fetchData(companyId);
				setOngoingComplianceItems(ongoing);
				setCompletedComplianceItems(completed);
			} catch (error) {
				console.error('Failed to fetch compliance data:', error);
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
		return <AllCompliancesSkeleton />;
	}

	return (
		<SidebarLayout>
			<header className='p-4 pt-12 pb-6'>
				<h1 className='text-2xl font-bold'>All Compliances</h1>
			</header>
			<main className='px-4'>
				<Tabs defaultValue='ongoing' className='w-full'>
					<TabsList className='grid w-full grid-cols-2 mb-4'>
						<TabsTrigger value='ongoing'>Ongoing</TabsTrigger>
						<TabsTrigger value='completed'>Completed</TabsTrigger>
					</TabsList>

					<TabsContent value='ongoing' className='space-y-2'>
						{ongoingComplianceItems.map((item: ComplianceItem) => (
							<ChecklistCard
								key={item.id}
								title={item.compliance.title}
								type={item.compliance.category}
								timeframe={item.compliance.dueDateRule}
								href={`/all-compliances/${item.compliance.id}?company=${companyId}`}
							/>
						))}
					</TabsContent>

					<TabsContent value='completed' className='space-y-2'>
						{completedComplianceItems.length > 0 ? (
							completedComplianceItems.map((item: ComplianceItem) => (
								<div
									key={item.id}
									className='bg-gray-50 p-4 rounded-lg flex items-center justify-between'
								>
									<div className='flex items-center'>
										<div className='mr-2'>
											<h3 className='font-medium'>{item.title}</h3>
											<span className='text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full'>
												{item.type}
											</span>
										</div>
									</div>
									<CheckCircle className='h-5 w-5 text-green-500' />
								</div>
							))
						) : (
							<div className='flex items-center justify-center h-full'>
								<p className='text-gray-500'>No completed compliances yet !</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</main>
		</SidebarLayout>
	);
}
