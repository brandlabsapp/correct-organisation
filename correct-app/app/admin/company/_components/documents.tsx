'use client';

import { useState, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import {
	Folder,
	File,
	ChevronRight,
	ChevronDown,
	Trash,
	Plus,
	Search,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Uploader from '@/components/custom/vault/Uploader';
import { useSearchParams } from 'next/navigation';
import { showErrorToast } from '@/lib/utils/toast-handlers';
import { DocumentViewer } from '@/components/custom/vault/document-viewer';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { getColumns } from './columns';

namespace vault {
	export interface Folder {
		id?: number;
		uuid?: string;
		name: string;
		parentId: number | null;
		userId: number | null;
		companyId: number;
		createdAt?: string;
		updatedAt?: string;
	}
}

interface Document {
	id?: number;
	name: string;
	type: string;
	size?: number;
	url?: string;
	children?: Document[];
	uuid?: string;
	uploadDate?: string;
	description?: string | null;
	filetype?: string;
	extension?: string;
	folderId?: string | number | null;
	createdAt?: string;
	updatedAt?: string;
}

export function Documents({
	document,
	folder,
}: {
	document: any[];
	folder: any[];
}) {
	const transformData = (docs: any[], folds: any[]): Document[] => {
		const transformFolder = (folder: any): Document => ({
			id: folder.id.toString(),
			name: folder.name,
			type: 'folder',
			createdAt: new Date(folder.createdAt).toISOString().split('T')[0],
			children: [
				...folds.filter((f) => f.parentId === folder.id).map(transformFolder),
				...docs
					.filter((doc) => doc.folderId === folder.id)
					.map((doc) => ({
						id: doc.id.toString(),
						name: doc.name,
						type: 'file' as const,
						createdAt: new Date(doc.createdAt).toISOString().split('T')[0],
						size: doc.size,
						url: doc.url,
						uuid: doc.uuid,
						description: doc.description,
						filetype: doc.filetype,
						extension: doc.extension,
					})),
			],
		});

		const rootFolders = folds.filter((f) => !f.parentId).map(transformFolder);

		const rootDocs = docs
			.filter((doc) => !doc.folderId)
			.map((doc) => ({
				id: doc.id.toString(),
				name: doc.name,
				type: 'file' as const,
				createdAt: new Date(doc.createdAt).toISOString().split('T')[0],
				size: doc.size,
				url: doc.url,
				uuid: doc.uuid,
				description: doc.description,
				filetype: doc.filetype,
				extension: doc.extension,
			}));

		return [...rootFolders, ...rootDocs];
	};

	const [documents, setDocuments] = useState<Document[]>(
		transformData(document, folder)
	);
	const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
	const [currentPath, setCurrentPath] = useState<(string | number)[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
	const [currentFolder, setCurrentFolder] = useState<vault.Folder | null>(null);
	const [folders, setFolders] = useState<vault.Folder[]>([]);
	const [selectedDocument, setSelectedDocument] = useState<Document | null>(
		null
	);
	const [breadcrumbs, setBreadcrumbs] = useState<
		{ id: string | number; name: string }[]
	>([]);

	const query = useSearchParams();
	const companyId = query.get('companyId');

	const handleFileUpload = async (file: File) => {
		const existingDoc = documents?.find(
			(doc) =>
				doc.name.toLowerCase() === file.name.toLowerCase() &&
				doc.folderId === currentFolder?.id
		);
		if (existingDoc) {
			toast({
				title: 'Duplicate File Name',
				description: `A file named "${file.name}" already exists in this folder.`,
				variant: 'destructive',
			});
			return;
		}

		const folderName = folders.find(
			(folder) => folder.uuid === currentFolder?.uuid
		)?.name;

		const payload = {
			size: file.size,
			category: 'compliance',
			name: String(file.name),
			extension: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
			filetype: file.type,
			// url: response.url,
			folderId: currentFolder ? currentFolder.id : null,
			tags: ['compliance'], //TODO: tags needs to be changed.
			companyId: companyId,
			// key: response.key,
		};

		const formData = new FormData();
		formData.append('file', file);
		formData.append('payload', JSON.stringify(payload));

		const result = await fetch('/api/vault/documents', {
			method: 'POST',
			body: formData,
		});

		const data = await result.json();

		if (!data.success) {
			toast({
				title: 'Failed to Upload File',
				description: data.message,
				variant: 'destructive',
			});
			return;
		}

		const newDocument: Document = {
			name: file.name,
			type: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
			// url: response.url || '',
			extension: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
			uploadDate: new Date().toISOString().split('T')[0],
			size: file.size,
			folderId: currentFolder?.uuid || null,
		};

		if (Array.isArray(documents)) {
			toast({
				title: 'File Uploaded',
				description: 'File uploaded successfully',
			});
			setDocuments([...documents, newDocument]);
		}

		// if (!response.success) {
		// 	toast({
		// 		title: 'Failed to Upload File',
		// 		description: 'Failed to upload file. Please try again.',
		// 		variant: 'destructive',
		// 	});
		// 	return;
		// }

		setIsUploadDialogOpen(false);
	};

	const toggleFolder = (folderId: string | undefined) => {
		if (folderId === undefined) return;
		setExpandedFolders((prev) => {
			const next = new Set(prev);
			if (next.has(folderId)) {
				next.delete(folderId);
			} else {
				next.add(folderId);
			}
			return next;
		});
	};

	const handleRemove = (id: string | number | undefined) => {
		if (id === undefined) return;
		const removeItem = (items: Document[]): Document[] => {
			return items.filter((item) => {
				if (item.id === id) return false;
				if (item.children) {
					item.children = removeItem(item.children);
				}
				return true;
			});
		};
		setDocuments(removeItem(documents));
		toast({
			title: 'Item Removed',
			description: 'The item has been successfully removed.',
		});
	};

	const handleViewDocument = async (document: Document) => {
		if (!document.id) {
			showErrorToast({
				title: 'No ID Found',
				message: 'No ID found for this document.',
			});
			return;
		}
		const response = await fetch(
			`/api/vault/documents/presigned-url/${document.id}`
		);
		const { data } = await response.json();
		console.log('data', data);
		setSelectedDocument({
			...document,
			url: data,
		});
	};

	const renderDocuments = (docs: Document[], depth = 0): JSX.Element[] => {
		return docs.flatMap((doc) => {
			const isExpanded = expandedFolders.has(doc.id?.toString() || '');
			const rows: JSX.Element[] = [
				<TableRow key={doc.id} className='hover:bg-gray-50'>
					<TableCell className='font-medium'>
						<div
							className='flex items-center'
							style={{ paddingLeft: `${depth * 20}px` }}
						>
							{doc.type === 'folder' && (
								<Button
									variant='ghost'
									size='icon'
									onClick={() => toggleFolder(String(doc.id))}
									className='h-8 w-8 p-0'
								>
									{isExpanded ? (
										<ChevronDown className='h-4 w-4 text-gray-500' />
									) : (
										<ChevronRight className='h-4 w-4 text-gray-500' />
									)}
								</Button>
							)}
							{doc.type === 'folder' ? (
								<>
									<Folder className='mr-2 h-4 w-4 text-blue-500' />
									<div className='font-medium'>{doc.name}</div>
								</>
							) : (
								<>
									<File className='mr-2 h-4 w-4 text-gray-500' />
									<div
										className='cursor-pointer hover:text-blue-600 hover:underline'
										onClick={() => handleViewDocument(doc)}
									>
										{doc.name}
									</div>
								</>
							)}
						</div>
					</TableCell>
					<TableCell>
						<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
							{doc.type}
						</span>
					</TableCell>
					<TableCell className='text-gray-600'>{doc.createdAt}</TableCell>
					<TableCell className='text-gray-600'>
						{doc.size ? `${(doc.size / 1024 / 1024).toFixed(2)} MB` : '-'}
					</TableCell>
					<TableCell>
						<div className='flex space-x-1'>
							<Button
								variant='ghost'
								size='icon'
								onClick={() => doc.id !== undefined && handleRemove(doc.id)}
								className='h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600'
							>
								<Trash className='h-4 w-4' />
							</Button>
							{doc.type === 'folder' && (
								<Button
									variant='ghost'
									size='icon'
									onClick={() => doc.id && setCurrentPath([...currentPath, doc.id])}
									className='h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600'
								>
									<Plus className='h-4 w-4' />
								</Button>
							)}
						</div>
					</TableCell>
				</TableRow>,
			];

			if (doc.type === 'folder' && isExpanded && doc.children) {
				rows.push(...renderDocuments(doc.children, depth + 1));
			}

			return rows;
		});
	};

	const handleCreateFolder = async (folderName: string) => {
		if (!folderName || folderName.trim() === '') {
			toast({
				title: 'Invalid Folder Name',
				description: 'Folder name cannot be empty.',
				variant: 'destructive',
			});
			return;
		}

		const isDuplicate = folders.some(
			(folder) =>
				folder.name.toLowerCase() === folderName.toLowerCase() &&
				folder.parentId === (currentFolder?.id ?? null)
		);
		if (isDuplicate) {
			toast({
				title: 'Duplicate Folder Name',
				description: `A folder named "${folderName}" already exists in this directory.`,
				variant: 'destructive',
			});
			return;
		}

		const newFolder: vault.Folder = {
			name: folderName,
			parentId: currentFolder?.id ?? null,
			userId: null,
			companyId: Number(companyId),
		};

		const response = await fetch('/api/vault/folders', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newFolder),
		});
		const data = await response.json();
		if (data.success) {
			newFolder.id = data.data.id;
			toast({
				title: 'Folder Created',
				description: 'Folder created successfully.',
			});
			setFolders([...folders, newFolder]);
		} else {
			toast({
				title: 'Failed to Create Folder',
				description: 'Failed to create folder. Please try again.',
				variant: 'destructive',
			});
		}
	};

	const handleFolderClick = (folder: Document) => {
		if (!folder.id) return;
		setCurrentPath([...currentPath, folder.id]);
		setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
		setCurrentFolder({
			id: Number(folder.id),
			name: folder.name,
			parentId: null,
			userId: null,
			companyId: Number(companyId),
		});
	};

	const navigateToBreadcrumb = (index: number) => {
		setCurrentPath(currentPath.slice(0, index + 1));
		setBreadcrumbs(breadcrumbs.slice(0, index + 1));
		const lastFolder = breadcrumbs[index];
		setCurrentFolder(
			lastFolder
				? {
						id: Number(lastFolder.id),
						name: lastFolder.name,
						parentId: null,
						userId: null,
						companyId: Number(companyId),
				  }
				: null
		);
	};

	const getCurrentFolderContents = (): Document[] => {
		let current = documents;
		for (const id of currentPath) {
			const folder = current.find(
				(item) => item.id === id && item.type === 'folder'
			);
			if (!folder || !folder.children) return [];
			current = folder.children;
		}
		return current;
	};

	const columns = getColumns({
		currentPath,
		handleFolderClick,
		handleViewDocument,
		handleRemove,
		setCurrentPath,
	});

	const filteredDocuments = getCurrentFolderContents().filter((doc) =>
		doc.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className='p-6 space-y-4'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-semibold text-gray-900'>Documents</h1>
			</div>

			<Card className='border-gray-200'>
				<CardContent className='p-4'>
					<div className='flex justify-between items-center'>
						<div className='flex items-center space-x-4'>
							<div className='relative'>
								<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
								<Input
									placeholder='Search documents...'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className='w-64 pl-10 border-gray-200 focus:ring-blue-500 focus:border-blue-500'
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className='flex items-center space-x-2 text-sm text-gray-600'>
				<Button
					variant='ghost'
					className='hover:text-blue-600'
					onClick={() => {
						setCurrentPath([]);
						setBreadcrumbs([]);
						setCurrentFolder(null);
					}}
				>
					Home
				</Button>
				{breadcrumbs.map((crumb, index) => (
					<div key={crumb.id} className='flex items-center space-x-2'>
						<ChevronRight className='h-4 w-4 text-gray-400' />
						<Button
							variant='ghost'
							className='hover:text-blue-600'
							onClick={() => navigateToBreadcrumb(index)}
						>
							{crumb.name}
						</Button>
					</div>
				))}
			</div>

			<div>
				<DataTable columns={columns} data={filteredDocuments} />
			</div>

			{filteredDocuments.length > 0 && (
				<div className='text-sm text-gray-500'>
					Showing {filteredDocuments.length} document
					{filteredDocuments.length !== 1 ? 's' : ''}
				</div>
			)}

			{selectedDocument && (
				<DocumentViewer
					document={selectedDocument}
					onClose={() => setSelectedDocument(null)}
				/>
			)}
		</div>
	);
}
