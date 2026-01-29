'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { SidebarLayout } from '@/components/common/sidebar-layout';
import { Separator } from '@/components/ui/separator';
import { ComplianceDetailSkeleton } from './_components/ComplianceDetailSkeleton';

import TasksSection from './_components/TasksSection';
import OverviewSection from './_components/OverviewSection';
import DocumentsSection from './_components/DocumentsSection';
import GuidesSupportSection from './_components/GuidesSupportSection';
import ComplianceDetailHeader from './_components/ComplianceDetailHeader';

interface ComplianceItem {
	id: string;
	title: string;
	type: string;
	timeframe: string;
	status: string;
	compliance: {
		title: string;
		category: string;
		dueDateRule: string;
	};
	companyComplianceTasks: {
		id: string;
		title: string;
		description: string;
		dueDate: string;
		complianceId: string;
		task: {
			id: string;
			title: string;
			description: string;
			deadline: string;
			complianceId: string;
			assignees: number[];
		};
	}[];
}

const fetchData = async (
	companyId: string,
	checklistId: string
): Promise<ComplianceItem | null> => {
	const baseUrl =
		process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
	const checkListUrl = `${baseUrl}/api/checklist/company/${companyId}?checklistId=${checklistId}`;

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
			return null;
		}

		const { data } = await response.json();

		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		return null;
	}
};

export default function ComplianceDetailPage() {
	const params = useParams();
	const searchParams = useSearchParams();
	const id = params.id as string;
	const company = searchParams.get('company');

	const [complianceDetail, setComplianceDetail] = useState<ComplianceItem | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!id || !company) {
			setIsLoading(false);
			return;
		}

		const loadData = async () => {
			try {
				const data = await fetchData(company, id);
				setComplianceDetail(data);
			} catch (error) {
				console.error('Failed to fetch compliance detail:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [id, company]);

	if (!id || !company) {
		console.error('No id provided');
		return null;
	}

	if (isLoading) {
		return <ComplianceDetailSkeleton />;
	}

	if (!complianceDetail) {
		return <div>Loading...</div>;
	}

	const overview = {
		content: {
			purpose:
				"Appointment of the company's first statutory auditor within 30 days of incorporation.",
			detailedInfo:
				'All the companies registered, like a private limited company or limited company are required to maintain a proper book of accounts and get the book of accounts audited. Therefore, after the incorporation of the company, an auditor must be appointed by the Board of Directors of the Company. First auditors of the company must be appointed within 30 days of the date of registration of the company by the Directors if not the shareholders can appoint first auditors within 90 days of incorporation. In this article, we look at the requirement and procedure for the appointment of an auditor.',
			applicableLaw: 'Section 139(1) of the Companies Act, 2013.',
			penalty:
				'Company and officers may be fined up to ₹1 lakh + ₹5,000/ day of default.',
		},
	};
	const documents = {
		documents: [
			{
				name: 'Auditor Consent Letter (signed PDF)',
				type: 'pdf' as const,
				signed: true,
			},
			{ name: 'Board Resolution', type: 'template' as const, downloadable: true },
			{ name: 'Form ADT-1', type: 'template' as const, downloadable: true },
			{
				name: 'MCA filing acknowledgment',
				type: 'template' as const,
				downloadable: true,
			},
			{
				name: "CA's Certificate of Practice",
				type: 'template' as const,
				downloadable: true,
			},
			{ name: 'Other', type: 'template' as const, downloadable: true },
		],
	};

	const guidesSupport = {
		videoTitle: 'FILING ADT-1',
		videoSubtitle: 'ON MCA',
		videoEvent: '(STEP-BY-STEP)',
		videoTag1: 'MCA',
		videoTag2: 'ADT-1',
		frameworkDocs: [
			{
				title: 'Framework for ship leasing',
				category: 'Commercial',
				date: '30th May, 2023',
				imageUrl:
					'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			},
			{
				title: 'Framework for ship leasing',
				category: 'Commercial',
				date: '30th May, 2023',
				imageUrl:
					'https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			},
		],
	};

	const header = {
		title: complianceDetail?.compliance.title,
		badgeText: complianceDetail?.compliance.category,
		dueDateText: `Due: ${new Date(
			complianceDetail?.compliance.dueDateRule
		).toLocaleDateString()}`,
		daysLeftText: '29 Days left',
		progressPercentage: 25,
		backLink: '/all-compliances',
	};

	const tasks = complianceDetail.companyComplianceTasks.map((task) => ({
		id: parseInt(task.id),
		title: task?.task?.title || task?.title,
		dueDate: task.dueDate,
		deadline: task.task?.deadline,
		assignees: [],
		completed: false,
	}));

	return (
		<SidebarLayout>
			<div className='space-y-4'>
				<ComplianceDetailHeader {...header} />
				<TasksSection
					initialTasks={tasks}
					compliance={complianceDetail}
					availableUsers={[]}
				/>
				<Separator className='my-4 bg-lightgray-dark' />
				<OverviewSection content={overview.content} />
				<Separator className='my-4 bg-lightgray-dark' />
				<DocumentsSection documents={documents.documents} />
				<Separator className='my-4 bg-lightgray-dark' />
				<GuidesSupportSection {...guidesSupport} />
			</div>
		</SidebarLayout>
	);
}
