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
	const baseUrl =
		process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
	const folderUrl = `${baseUrl}/api/vault/folders/folder/${folderId}`;

	const response = await fetch(folderUrl, {
		cache: 'no-store',
	});

	const data = await response.json();

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
