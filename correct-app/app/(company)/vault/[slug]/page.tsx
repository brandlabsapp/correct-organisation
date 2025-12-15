import type { Metadata } from 'next';
import DocumentManagement from '@/components/custom/vault/DocumentManagement';

// ---------------- fetch data from the server ----------------
async function fetchData(folderId?: string) {
	if (!folderId) {
		console.error('No folderId provided');
		return;
	}
	const baseUrl =
		process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
	const folderUrl = `${baseUrl}/api/vault/folders/folder/${folderId}`;

	const response = await fetch(folderUrl, {
		cache: 'no-store',
	});
	console.log('response', response);

	const data = await response.json();
	console.log('data', data);

	if (!response.ok) {
		console.error('Failed to fetch data', response);
		throw new Error('Failed to fetch data');
	}

	return {
		folders: data.data.childFolders || [],
		documents: data.data.documents || [],
		currentFolder: data?.data,
	};
}

async function fetchDataCompany(companyId: string) {
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
	params: Promise<{ slug?: string }>;
	searchParams: Promise<{ company: string }>;
}) {
	const searchParams = await props.searchParams;
	const params = await props.params;
	console.log('params', params);
	if (!params.slug) {
		console.error('No folderId provided');
	}
	const data = await fetchData(params.slug);
	const companyFolders = await fetchDataCompany(searchParams.company);
	const companyId = searchParams.company;

	return (
		<DocumentManagement
			folders={data?.folders || []}
			companyFolders={companyFolders?.folders || []}
			documents={data?.documents || []}
			currentFolder={data?.currentFolder || null}
			folderId={params.slug}
			companyId={companyId}
		/>
	);
}
