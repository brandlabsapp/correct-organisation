'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DocumentManagement from '@/components/custom/vault/DocumentManagement';
import { VaultSkeleton } from './_components/VaultSkeleton';

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

export default function Vault() {
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [data, setData] = useState<{
		folders: any[];
		documents: any[];
		currentFolder: any;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!companyId) {
			setIsLoading(false);
			return;
		}

		const loadData = async () => {
			try {
				const result = await fetchData(companyId);
				setData(result || null);
			} catch (error) {
				console.error('Failed to fetch vault data:', error);
				setData(null);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [companyId]);

	if (!companyId) {
		console.error('No companyId provided');
		return null;
	}

	if (isLoading) {
		return <VaultSkeleton />;
	}

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
