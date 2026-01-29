import DocumentManagement from '@/components/custom/vault/DocumentManagement';
import type { Metadata } from 'next';

// --------fetch data from the server-------
async function fetchData(companyId: string) {
	if (!companyId) {
		console.error('No companyId provided');
		return;
	}
	// Backend runs on port 8000 with global prefix api/v1 (see correct-backend main.ts)
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
	const documents = Array.from(
		new Set([...(payload?.documents ?? [])])
	);
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
