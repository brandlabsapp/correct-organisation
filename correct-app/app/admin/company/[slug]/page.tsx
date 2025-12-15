import Dashboard from '../_components/dashboard';

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

export default async function CompanyPage(props: {
	params: Promise<{ slug: string }>;
}) {
	const params = await props.params;
	const slug = params.slug;
	const [companyDetails, allCompliances] = await Promise.all([
		fetchCompanyDetails(slug),
		fetchAllCompliances(),
	]);

	console.log('companyDetails', companyDetails);
	console.log('allCompliances', allCompliances);

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
