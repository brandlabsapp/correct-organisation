import DocumentManagement from '@/components/custom/vault/DocumentManagement';
import type { Metadata } from 'next';

// --------fetch data from the server-------
async function fetchData(companyId: string) {
	if (!companyId) {
		console.error('No companyId provided');
		return;
	}
	const baseUrl =
		process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
	const folderUrl = `${baseUrl}/api/vault/company/${companyId}`;

	const response = await fetch(folderUrl, {
		cache: 'no-store',
	});

	if (!response.ok) {
		console.error('Failed to fetch data', response);
		throw new Error('Failed to fetch data');
	}
	const { data } = await response.json();

	console.log('data', data);

	const folders = data.folders || [];
	const documents = Array.from(new Set([...data.documents]));
	const currentFolder = data.folders[0] || null;

	if (!response.ok) {
		console.error('Failed to fetch data', response);
		throw new Error('Failed to fetch data');
	}

	return {
		folders,
		documents,
		currentFolder,
	};
}

export const metadata: Metadata = {
	title: 'Vault',
	description: 'Vault',
	keywords: [
		'Vault',
		'Compliance',
		'Compliance Management',
		'Compliance Tracker',
	],
};

// ---------------- Server Component ----------------
export default async function Vault(props: {
	searchParams: Promise<{ company: string }>;
}) {
	const searchParams = await props.searchParams;
	if (!searchParams.company) {
		console.error('No companyId provided');
		return null;
	}

	const companyId = searchParams.company;
	const data = await fetchData(companyId);

	return (
		<DocumentManagement
			folders={data?.folders || []}
			companyFolders={data?.folders || []}
			documents={data?.documents || []}
			currentFolder={data?.currentFolder || null}
			companyId={companyId}
		/>
	);
}
