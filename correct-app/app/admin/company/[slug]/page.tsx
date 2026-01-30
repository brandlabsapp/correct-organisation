'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Dashboard from '../_components/dashboard';
import { LoadingFallback } from '@/components/common/LoadingFallback';

const fetchCompanyDetails = async (slug: string) => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
	const response = await fetch(`${baseUrl}/api/admin/company/${slug}`, {
		cache: 'no-store',
	});
	const data = await response.json();

	if (!data.success) {
		throw new Error(data.message);
	}

	const companyData = {
		companyDetails: data.data,
		members: data.data.members,
		checklist: data.data.checklists,
		documents: data.data.documents,
		folders: data.data.folders,
	};
	return companyData;
};

const fetchAllCompliances = async () => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
	const response = await fetch(`${baseUrl}/api/compliances-list`, {
		cache: 'no-store',
	});
	const data = await response.json();
	if (!data.success) {
		throw new Error(data.message);
	}
	return data.data;
};

export default function CompanyPage() {
	const params = useParams();
	const slug = params.slug as string;

	const [companyDetails, setCompanyDetails] = useState<any>(null);
	const [allCompliances, setAllCompliances] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!slug) {
			setIsLoading(false);
			return;
		}

		const loadData = async () => {
			try {
				const [companyData, compliancesData] = await Promise.all([
					fetchCompanyDetails(slug),
					fetchAllCompliances(),
				]);
				setCompanyDetails(companyData);
				setAllCompliances(compliancesData);
			} catch (error) {
				console.error('Failed to fetch company data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [slug]);

	if (isLoading) {
		return <LoadingFallback />;
	}

	if (!companyDetails) {
		return <div>Failed to load company details</div>;
	}

	return (
		<div className='bg-white'>
			<Dashboard
				companyData={companyDetails.companyDetails}
				members={companyDetails.members}
				checklist={companyDetails.checklist}
				folders={companyDetails.folders}
				documents={companyDetails.documents}
				allCompliances={allCompliances}
				companyId={slug}
			/>
		</div>
	);
}
