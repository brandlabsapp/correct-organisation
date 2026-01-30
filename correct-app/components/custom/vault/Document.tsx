import React, { useState } from 'react';
import { SiGoogledocs, SiGooglesheets, SiGoogledrive } from 'react-icons/si';
import { FaRegFilePdf, FaRegFileImage } from 'react-icons/fa6';
import { DocumentActionSheet } from '@/components/custom/vault/DocumentActionSheet';
import { MoveDialog } from '@/components/custom/vault/MoveDialog';
import StatusModal from '@/components/common/Modals/StatusModal';
import InputModal from '@/components/common/Modals/InputModal';

interface FolderWithChildren extends vault.Folder {
	childFolders?: FolderWithChildren[];
}

interface DocumentProps {
	document: vault.Document;
	handleViewDocument: (document: vault.Document) => void;
	onShare?: () => void;
	onDownload?: () => void;
	totalFolders: FolderWithChildren[];
	setIsMovingDocument: (value: boolean) => void;
	handleMoveComplete: (
		document: vault.Document,
		newFolderId: number | null
	) => void;
	handleDelete: () => void;
	handleRename: (newName: string, documentUuid?: string | null) => void;
}

const getFileIcon = (extension: string | undefined) => {
	if (!extension) return null;
	if (
		extension.toLowerCase().includes('docs') ||
		extension.toLowerCase().includes('docx')
	) {
		return <SiGoogledocs className='min-h-6 min-w-6 text-blue-600' />;
	} else if (
		extension.toLowerCase().includes('sheets') ||
		extension.toLowerCase().includes('xlsx')
	) {
		return <SiGooglesheets className='min-h-6 min-w-6 text-green-600' />;
	} else if (extension.toLowerCase().includes('pdf')) {
		return <FaRegFilePdf className='min-h-6 min-w-6 text-red-600' />;
	} else if (
		extension.toLowerCase().includes('image') ||
		extension.toLowerCase().includes('png') ||
		extension.toLowerCase().includes('jpg') ||
		extension.toLowerCase().includes('jpeg') ||
		extension.toLowerCase().includes('gif')
	) {
		return <FaRegFileImage className='min-h-6 min-w-6 text-gray-600' />;
	}
	return <SiGoogledrive className='min-h-6 min-w-6 text-gray-600' />;
};

const Document = ({
	document,
	handleViewDocument,
	onShare,
	onDownload,
	totalFolders,
	setIsMovingDocument,
	handleMoveComplete,
	handleDelete,
	handleRename,
}: DocumentProps) => {
	const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
	const [newFileName, setNewFileName] = useState(document.name);

	const handleMove = () => {
		setIsMovingDocument(true);
		setIsMoveDialogOpen(true);
	};

	const handleDeleteClick = () => {
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		handleDelete();
		setIsDeleteDialogOpen(false);
	};

	const handleRenameClick = () => {
		setNewFileName(document.name);
		setIsRenameDialogOpen(true);
	};

	const handleConfirmRename = () => {
		if (newFileName.trim() !== '') {
			handleRename(newFileName, document.uuid);
			setIsRenameDialogOpen(false);
		}
	};

	return (
		<div className='flex items-center justify-between space-x-3 p-4 md:p-5 lg:p-6 bg-lightgray rounded-lg mb-2 md:mb-3 hover:bg-lightgray-light transition-colors cursor-pointer'>
			<div
				className='flex items-center gap-3 md:gap-4 min-w-0 flex-1'
				onClick={() => handleViewDocument(document)}
			>
				{getFileIcon(document.extension)}
				<h3 className='text-body3 md:text-body2 font-medium text-black truncate'>
					{document.name}
				</h3>
			</div>
			<div>
				<DocumentActionSheet
					fileName={document.name}
					fileSize={document.size ? `${document.size} KB` : undefined}
					createdAt={
						document.createdAt
							? new Date(document.createdAt).toLocaleDateString()
							: undefined
					}
					onShare={onShare}
					onDownload={onDownload}
					onRename={handleRenameClick}
					onMove={handleMove}
					onDelete={handleDeleteClick}
					icon={getFileIcon(document.extension)}
				/>
			</div>
			{isMoveDialogOpen && (
				<MoveDialog
					isOpen={isMoveDialogOpen}
					totalFolders={totalFolders}
					onClose={() => {
						setIsMoveDialogOpen(false);
						setIsMovingDocument(false);
					}}
					onMove={(newFolderId) => {
						handleMoveComplete(document, newFolderId);
						setIsMoveDialogOpen(false);
					}}
				/>
			)}

			{isDeleteDialogOpen && (
				<StatusModal
					title='Delete File'
					message={`Are you sure you want to delete this file?`}
					status='error'
					buttonText='Delete'
					onButtonClick={handleConfirmDelete}
					open={isDeleteDialogOpen}
					setOpen={setIsDeleteDialogOpen}
				/>
			)}

			{isRenameDialogOpen && (
				<InputModal
					open={isRenameDialogOpen}
					onOpenChange={setIsRenameDialogOpen}
					placeholder='Enter new filename'
					buttonText='Rename'
					onClick={handleConfirmRename}
					title='Rename File'
					value={newFileName}
					setValue={setNewFileName}
				/>
			)}
		</div>
	);
};

export default Document;
