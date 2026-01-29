'use client';

import { useEffect, useState } from 'react';
import ComplianceTabs from './_components/ComplianceTabs';
import { LoadingFallback } from '@/components/common/LoadingFallback';

const fetchAllCompanies = async () => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
	const companyUrl = `${baseUrl}/api/company`;

	try {
		const response = await fetch(companyUrl, {
			cache: 'no-store',
		});

		const data = await response.json();

		if (data.state !== 'success') {
			return [];
		}

		return data.data;
	} catch (error) {
		console.error('Error fetching companies:', error);
		throw error;
	}
};

const fetchAllCompliances = async () => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
	const complianceUrl = `${baseUrl}/api/compliances-list`;

	const response = await fetch(complianceUrl, {
		cache: 'no-store',
	});

	const data = await response.json();

	if (data.state !== 'success') {
		return [];
	}

	return data.data;
};

export default function Compliances() {
	const [companies, setCompanies] = useState<any[]>([]);
	const [compliances, setCompliances] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const [companiesData, compliancesData] = await Promise.all([
					fetchAllCompanies(),
					fetchAllCompliances(),
				]);
				setCompanies(companiesData);
				setCompliances(compliancesData);
			} catch (error) {
				console.error('Failed to fetch data:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	if (isLoading) {
		return <LoadingFallback />;
	}

	return (
		<ComplianceTabs
			initialComplianceData={compliances}
			initialCompanyData={companies}
		/>
	);
}
