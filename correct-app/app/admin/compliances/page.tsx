import ComplianceTabs from './_components/ComplianceTabs';

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

export default async function Compliances() {
	const companies = await fetchAllCompanies();
	const compliances = await fetchAllCompliances();
	return (
		<ComplianceTabs
			initialComplianceData={compliances}
			initialCompanyData={companies}
		/>
	);
}
