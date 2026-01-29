import type { Metadata } from 'next';
import DocumentManagement from '@/components/custom/vault/DocumentManagement';

// ---------------- fetch data from the server ----------------
async function fetchData(folderId?: string) {
	if (!folderId) {
		console.error('No folderId provided');
		return;
	}
	// Backend runs on port 8000 with global prefix api/v1; route is GET /vault/folder/:uuid
	const baseUrl =
		process.env.SERVER_URL || 'http://localhost:8000/api/v1';
	const folderUrl = `${baseUrl}/vault/folder/${folderId}`;

	const response = await fetch(folderUrl, {
		cache: 'no-store',
	});

	if (!response.ok) {
		console.error('Failed to fetch data', response);
		throw new Error('Failed to fetch data');
	}
	// Backend returns the folder object directly (no "data" wrapper)
	const folder = await response.json();

	return {
		folders: folder?.childFolders ?? [],
		documents: folder?.documents ?? [],
		currentFolder: folder ?? null,
	};
}

async function fetchDataCompany(companyId: string) {
	if (!companyId) {
		console.error('No companyId provided');
		return;
	}
	// Backend runs on port 8000 with global prefix api/v1 (same as main vault page)
	const baseUrl =
		process.env.SERVER_URL || 'http://localhost:8000/api/v1';
	const folderUrl = `${baseUrl}/vault/company/${companyId}`;

	const response = await fetch(folderUrl, {
		cache: 'no-store',
	});

	if (!response.ok) {
		console.error('Failed to fetch data', response);
		throw new Error('Failed to fetch data');
	}
	// Backend returns { folders, documents } directly (no "data" wrapper)
	const payload = await response.json();
	const folders = payload?.folders ?? [];
	const documents = Array.from(new Set([...(payload?.documents ?? [])]));
	const currentFolder = folders[0] ?? null;

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
