'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import DocumentManagement from '@/components/custom/vault/DocumentManagement';
import { LoadingFallback } from '@/components/common/LoadingFallback';

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

export default function Vault() {
	const params = useParams();
	const searchParams = useSearchParams();
	const slug = params.slug as string | undefined;
	const companyId = searchParams.get('company') || '';

	const [data, setData] = useState<{
		folders: any[];
		documents: any[];
		currentFolder: any;
	} | null>(null);
	const [companyFolders, setCompanyFolders] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!slug) {
			console.error('No folderId provided');
			setIsLoading(false);
			return;
		}

		const loadData = async () => {
			try {
				const [folderData, companyData] = await Promise.all([
					fetchData(slug),
					fetchDataCompany(companyId),
				]);
				setData(folderData || null);
				setCompanyFolders(companyData?.folders || []);
			} catch (error) {
				console.error('Failed to fetch vault data:', error);
				setData(null);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [slug, companyId]);

	if (isLoading) {
		return <LoadingFallback />;
	}

	return (
		<DocumentManagement
			folders={data?.folders || []}
			companyFolders={companyFolders}
			documents={data?.documents || []}
			currentFolder={data?.currentFolder || null}
			folderId={slug}
			companyId={companyId}
		/>
	);
}
