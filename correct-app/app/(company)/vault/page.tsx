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
