'use client';

import React, { useState, useEffect } from 'react';
import { DocumentViewer } from '@/components/custom/vault/document-viewer';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Uploader from '@/components/custom/vault/Uploader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SidebarLayout } from '@/components/common/sidebar-layout';
import { useUserAuth } from '@/contexts/user';
import {
	showSuccessToast,
	showErrorToast,
	showLoadingToast,
} from '@/lib/utils/toast-handlers';
import Folder from '@/components/custom/vault/Folder';
import Document from '@/components/custom/vault/Document';
import CompanySelect, {
	type CompanySelectProps,
} from '@/components/profile/CompanySelect';
import { uploadFileToSupabaseClient } from '@/app/lib/supabase/supabase-db';

export default function DocumentManagement({
	folders: initialFolders = [],
	companyFolders: initialCompanyFolders = [],
	documents: initialDocuments = [],
	currentFolder: initialCurrentFolder,
	folderId,
	companyId,
}: {
	folders: vault.Folder[];
	companyFolders: vault.Folder[];
	documents: vault.Document[];
	currentFolder: vault.Folder | null;
	folderId?: string | undefined;
	companyId: string;
}) {
	// ---------------- Hooks ----------------
	const { user, company } = useUserAuth();
	const { dismiss, toast } = useToast();
	const router = useRouter();

	// ---------------- Local State ----------------
	const initialChildFolder = folderId ? initialCurrentFolder : null;
	const initialCompanyFoldersData = folderId
		? initialCompanyFolders
		: initialFolders;

	const [documents, setDocuments] = useState<vault.Document[]>(initialDocuments);
	const [folders, setFolders] = useState<vault.Folder[]>(initialFolders);
	const [foldersToMove, setFoldersToMove] = useState<vault.Folder[]>(
		initialCompanyFoldersData
	);
	const [selectedDocument, setSelectedDocument] =
		useState<vault.Document | null>(null);
	const [currentFolder, setCurrentFolder] = useState<vault.Folder | null>(
		initialChildFolder
	);
	// to implement AES encryption we need to generate a secret key
	// const [encryptionKey, setEncryptionKey] = useState(
	// 	CryptoJS.lib.WordArray.random(32).toString()
	// );

	const [selectedCompany, setSelectedCompany] =
		useState<AppTypes.Company | null>(company);

	const [filteredDocs, setFilteredDocs] = useState<vault.Document[]>([]);
	const [filteredFoldersList, setFilteredFoldersList] = useState<vault.Folder[]>(
		[]
	);

	const totalCompanies = [
		...(user?.companyMembers?.map((member) => member.company) || []),
		...(user?.companyDetails || []),
	];

	const [isMovingDocument, setIsMovingDocument] = useState<boolean>(false);

	// ---------------- Effects ----------------
	useEffect(() => {
		const docsToShow = documents.filter((doc) => {
			if (currentFolder) {
				return (
					doc.folderId === currentFolder.uuid || doc.folderId === currentFolder.id
				);
			}

			return !doc.folderId;
		});

		const foldersToShow = folders.filter((folder) => {
			if (isMovingDocument) {
				return currentFolder ? folder.id !== currentFolder.id : true;
			}

			if (currentFolder) {
				return folder.parentId === currentFolder.id;
			}

			return folder.parentId === null;
		});

		setFilteredDocs(docsToShow);
		setFilteredFoldersList(foldersToShow);
	}, [documents, folders, currentFolder, isMovingDocument]);

	// ---------------- Functions ----------------

	//

	const handleFileUpload = async (file: File): Promise<void> => {
		const existingDoc = documents?.find(
			(doc) =>
				doc.name.toLowerCase() === file.name.toLowerCase() &&
				doc.folderId === currentFolder
		);
		if (existingDoc) {
			showErrorToast({
				title: 'Duplicate File Name',
				message: `A file named "${file.name}" already exists in this folder.`,
			});
			return;
		}

		// const encryptedFile = await encryptFile(file);
		// console.log('encryptedFile', encryptedFile);
		const loading = showLoadingToast({
			title: 'Uploading...',
			message: 'Please wait while we upload the file...',
		});

		const payload = {
			name: String(file.name),
			size: file.size,
			category: 'compliance',
			extension: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
			type: 'document',
			filetype: file.type,
			folderId: currentFolder ? currentFolder.id : null,
			tags: ['compliance'],
			userId: user?.id,
			companyId: company?.id,
			folder: currentFolder?.name,
		};

		const uploadResult = await uploadFileToSupabaseClient(
			file,
			companyId,
			currentFolder?.uuid || null,
			file.name
		);

		if (!uploadResult.success) {
			showErrorToast({
				title: 'Upload Failed',
				message: uploadResult.message,
			});
			return;
		}

		try {
			const response = await fetch('/api/vault/documents', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...payload,
					url: uploadResult.url,
					key: uploadResult.url,
					status: 'active',
				}),
			});

			const { data, success } = await response.json();

			if (!success) {
				throw new Error('Failed to store file metadata in database');
			}

			const newDocument: vault.Document = {
				id: data.id,
				name: file.name,
				type: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
				url: uploadResult.url || '',
				extension: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
				uploadDate: new Date().toISOString().split('T')[0],
				size: file.size,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				folderId: currentFolder?.uuid || null,
				key: uploadResult.url,
			};

			if (Array.isArray(documents)) {
				dismiss(loading.id);
				showSuccessToast({
					title: 'File Uploaded',
					message: 'File uploaded successfully',
				});
				setDocuments([...documents, newDocument]);
			}
		} catch (error) {
			console.error('Error storing file metadata:', error);
			showErrorToast({
				title: 'Database Error',
				message: 'File uploaded but failed to store metadata. Please try again.',
			});
		}
	};

	const handleDeleteDocument = async (doc: vault.Document) => {
		const loadingToast = toast({
			title: 'Deleting Document',
			description: 'Deleting document...',
			action: <Loader2 className='h-4 w-4 animate-spin' />,
		});
		if (selectedDocument?.id === doc.id) {
			setSelectedDocument(null);
		}
		const response = await fetch(`/api/vault/documents/${doc.id}`, {
			method: 'DELETE',
		});
		const data = await response.json();
		if (data.success) {
			dismiss(loadingToast.id);
			setDocuments(documents.filter((document) => document.id !== doc.id));
		} else {
			showErrorToast({
				title: 'Failed to Delete Document',
				message: 'Failed to delete document. Please try again.',
			});
		}
	};

	const handleViewDocument = async (document: vault.Document): Promise<void> => {
		if (!document.key) {
			showErrorToast({
				title: 'No Key Found',
				message: 'No key found for this document.',
			});
			return;
		}
		const response = await fetch(
			`/api/vault/documents/presigned-url/${document.id}`
		);
		const { data } = await response.json();
		setSelectedDocument({
			...document,
			url: data,
		});
	};

	// const handleDownloadDocument = async (doc: vault.Document) => {
	// 	try {
	// 		console.log('doc', doc);
	// 		const successToast = showSuccessToast({
	// 			title: 'Downloading Document',
	// 			message: 'Downloading document...',
	// 		});
	// 		const result = await fetch(`/api/vault/documents/presigned-url/${doc.id}`);
	// 		const { data } = await result.json();
	// 		console.log('data', data);
	// 		const response = await fetch(data);
	// 		if (!response.ok) {
	// 			showErrorToast({
	// 				title: 'Failed to Download Document',
	// 				message: 'Failed to download document. Please try again.',
	// 			});
	// 			return;
	// 		}
	// 		const blob = await decryptFile(await response.text());
	// 		console.log('blob', blob);
	// 		const url = window.URL.createObjectURL(blob);
	// 		const a = document.createElement('a');
	// 		a.href = url;
	// 		a.download = doc.name || 'downloaded_document';
	// 		document.body.appendChild(a);
	// 		a.click();
	// 		document.body.removeChild(a);
	// 		window.URL.revokeObjectURL(url);
	// 		dismiss(successToast.id);
	// 		showSuccessToast({
	// 			title: 'Downloaded Document',
	// 			message: 'Document downloaded successfully.',
	// 		});
	// 	} catch (error) {
	// 		console.error('Error downloading document:', error);
	// 		showErrorToast({
	// 			title: 'Failed to Download Document',
	// 			message: 'Failed to download document. Please try again.',
	// 		});
	// 	}
	// };

	const handleFolderClick = (folder: vault.Folder | null) => {
		setCurrentFolder(folder);
		router.push(
			folder?.uuid
				? `/vault/folder/${folder.uuid}?company=${companyId}`
				: `/vault?company=${companyId}`
		);
	};

	const handleCreateFolder = async (folderName: string): Promise<void> => {
		if (!folderName || folderName.trim() === '') {
			showErrorToast({
				title: 'Invalid Folder Name',
				message: 'Folder name cannot be empty.',
			});
			return;
		}

		const isDuplicate = folders.some(
			(folder) =>
				folder.name.toLowerCase() === folderName.toLowerCase() &&
				folder.parentId === currentFolder
		);
		if (isDuplicate) {
			showErrorToast({
				title: 'Duplicate Folder Name',
				message: `A folder named "${folderName}" already exists in this directory.`,
			});
			return;
		}

		const newFolder: vault.Folder = {
			name: folderName,
			parentId: currentFolder ? currentFolder?.id : null,
			userId: user?.id,
			companyId: company?.id,
		};

		const response = await fetch('/api/vault/folders', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newFolder),
		});
		const data = await response.json();
		if (data.success) {
			newFolder.id = data.data.id;
			showSuccessToast({
				title: 'Folder Created',
				message: 'Folder created successfully.',
			});
			setFolders([...folders, newFolder]);
			setFoldersToMove([...foldersToMove, newFolder]);
		} else {
			showErrorToast({
				title: 'Failed to Create Folder',
				message: 'Failed to create folder. Please try again.',
			});
		}
	};

	const handleDeleteFolder = async (folder: vault.Folder) => {
		if (!folder) {
			showErrorToast({
				title: 'No Folder Selected',
				message: 'No folder selected. Please select a folder to delete.',
			});
			return;
		}
		const response = await fetch(`/api/vault/folders/folder/${folder.id}`, {
			method: 'DELETE',
		});
		const data = await response.json();
		if (data.success) {
			showSuccessToast({
				title: 'Folder Deleted',
				message: 'Folder deleted successfully.',
			});
			const updatedFolders = folders.filter((f) => f.id !== folder.id);
			setFolders(updatedFolders);
		} else {
			showErrorToast({
				title: 'Failed to Delete Folder',
				message: 'Failed to delete folder. Please try again.',
			});
		}
	};

	const handleRenameFolder = async (folder: vault.Folder, newName: string) => {
		const updatedFolders = folders.map((f) =>
			f.id === folder.id ? { ...f, name: newName } : f
		);
		setFolders(updatedFolders);
		const response = await fetch(`/api/vault/folders/folder/${folder.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ name: newName }),
		});
		const data = await response.json();
		if (data.success) {
			showSuccessToast({
				title: 'Folder Renamed',
				message: 'Folder renamed successfully.',
			});
		} else {
			showErrorToast({
				title: 'Failed to Rename Folder',
				message: 'Failed to rename folder. Please try again.',
			});
		}
	};

	const handleRenameDocument = async (
		newName: string,
		documentId?: number | null
	) => {
		if (!documentId) {
			showErrorToast({
				title: 'No Document Selected',
				message: 'No document selected. Please select a document to rename.',
			});
			return;
		}
		const updatedDocuments = documents.map((doc) =>
			doc.id === documentId ? { ...doc, name: newName } : doc
		);
		setDocuments(updatedDocuments);
		const response = await fetch(`/api/vault/documents/${documentId}`, {
			method: 'PATCH',
			body: JSON.stringify({ name: newName }),
		});
		const data = await response.json();
		if (data.success) {
			showSuccessToast({
				title: 'Document Renamed',
				message: 'Document renamed successfully.',
			});
		} else {
			showErrorToast({
				title: 'Failed to Rename Document',
				message: 'Failed to rename document. Please try again.',
			});
		}
	};

	const handleMoveComplete = async (
		movedDocument: vault.Document,
		newFolderId: number | null
	) => {
		try {
			// Call your API to update the document's folder
			const response = await fetch(`/api/vault/documents/${movedDocument.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					folderId: newFolderId,
				}),
			});

			const { success } = await response.json();

			if (success) {
				// Update local state
				setDocuments((prevDocuments) => {
					return prevDocuments.map((doc) =>
						doc.id === movedDocument.id ? { ...doc, folderId: newFolderId } : doc
					);
				});

				// If we've moved a document out of the current folder, remove it from view
				if (currentFolder && newFolderId !== currentFolder.id) {
					setDocuments((prevDocuments) => {
						return prevDocuments.filter((doc) => doc.id !== movedDocument.id);
					});
				}

				showSuccessToast({
					title: 'Document Moved',
					message: 'Document moved successfully',
				});
			} else {
				throw new Error('Failed to move document');
			}
		} catch (error) {
			showErrorToast({
				title: 'Move Failed',
				message: 'Failed to move document. Please try again.',
			});
		} finally {
			setIsMovingDocument(false); // Reset move mode
		}
	};

	// ---------------- Render ----------------

	return (
		<SidebarLayout>
			<div className='p-5 md:p-6 lg:p-8 h-full overflow-y-scroll'>
				<div className='flex justify-between items-center mb-5 md:mb-6'>
					<div className='flex items-center gap-2'>
						<Link
							href={`/vault?company=${companyId}`}
							className='text-heading4 font-bold text-gray-800 hover:text-gray-600 hover:underline cursor-pointer'
						>
							Vault
						</Link>
						{currentFolder?.name && (
							<>
								<span className='text-gray-400'>/</span>
								<span className='text-heading4 font-semibold text-gray-700'>
									{currentFolder.name}
								</span>
							</>
						)}
					</div>
				</div>
				<div className='flex justify-between items-center'>
					<CompanySelect
						totalCompanies={totalCompanies}
						displayCompany={
							totalCompanies.find(
								(c) => String(c.id) === String(companyId)
							) ?? company
						}
					/>
				</div>
				{/* Grid scales up for desktop while preserving mobile layout */}
				<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-4 md:gap-6 mt-5 md:mt-6'>
					{filteredFoldersList.map((folder) => (
						<Folder
							key={folder.id}
							folder={folder}
							handleFolderClick={handleFolderClick}
							handleDeleteFolder={handleDeleteFolder}
							handleRenameFolder={handleRenameFolder}
						/>
					))}
					{filteredDocs.map((document) => (
						<Document
							key={document.id}
							document={document}
							handleViewDocument={handleViewDocument}
							totalFolders={foldersToMove}
							setIsMovingDocument={setIsMovingDocument}
							handleMoveComplete={handleMoveComplete}
							handleDelete={() => handleDeleteDocument(document)}
							handleRename={handleRenameDocument}
						/>
					))}
				</div>

				{selectedDocument && (
					<DocumentViewer
						document={selectedDocument}
						onClose={() => setSelectedDocument(null)}
					/>
				)}
				<Uploader
					handleCreateFolder={handleCreateFolder}
					handleFileUpload={handleFileUpload}
				/>
			</div>
		</SidebarLayout>
	);
}
