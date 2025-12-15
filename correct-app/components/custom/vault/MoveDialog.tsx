import React, { useState, useEffect, useMemo } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { FaFolder } from 'react-icons/fa';

interface FolderWithChildren extends vault.Folder {
	childFolders?: FolderWithChildren[];
}

interface MoveDialogProps {
	isOpen: boolean;
	onClose: () => void;
	totalFolders: FolderWithChildren[];
	onMove: (folderId: number | null) => void;
}

export function MoveDialog({
	isOpen,
	onClose,
	onMove,
	totalFolders,
}: MoveDialogProps) {
	const [currentModalFolder, setCurrentModalFolder] = useState<number | null>(
		null
	);
	const [folderHistory, setFolderHistory] = useState<number[]>([]);
	const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

	const currentFolders = useMemo(() => {
		if (currentModalFolder === null) {
			return totalFolders.filter((folder) => folder.parentId === null);
		}

		const childFolders = totalFolders.filter(
			(folder) => folder.parentId === currentModalFolder
		);
		if (childFolders.length > 0) {
			return childFolders;
		}
		const currentFolder = totalFolders.find((f) => f.id === currentModalFolder);
		return currentFolder?.childFolders || [];
	}, [currentModalFolder, totalFolders]);

	useEffect(() => {
		if (isOpen) {
			setCurrentModalFolder(null);
			setFolderHistory([]);
			setSelectedFolderId(null);
		}
	}, [isOpen]);

	const currentFolderName = useMemo(() => {
		if (currentModalFolder === null) return 'Move to Folder';
		const currentFolder = totalFolders.find((f) => f.id === currentModalFolder);
		return currentFolder?.name || 'Move to Folder';
	}, [currentModalFolder, totalFolders]);

	const handleFolderClick = (folder: FolderWithChildren) => {
		if (folder.id) {
			setFolderHistory((prev) => [...prev, currentModalFolder || 0]);
			setCurrentModalFolder(folder.id);
			setSelectedFolderId(folder.id);
		}
	};

	const handleBack = () => {
		const previousFolder = folderHistory[folderHistory.length - 1];
		setFolderHistory((prev) => prev.slice(0, -1));
		setCurrentModalFolder(previousFolder === 0 ? null : previousFolder);
		setSelectedFolderId(previousFolder === 0 ? null : previousFolder);
	};

	const handleMoveConfirm = () => {
		onMove(selectedFolderId);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-[400px] p-0 overflow-hidden bg-white'>
				<div className='p-6'>
					<DialogHeader className='mb-4'>
						<DialogTitle className='text-xl'>Move File</DialogTitle>
						<div className='text-sm text-gray-500 mt-1'>
							Current Location: {currentFolderName}
						</div>
					</DialogHeader>

					{currentModalFolder !== null && (
						<div className='mb-4'>
							<Button
								variant='ghost'
								onClick={handleBack}
								className='flex items-center gap-2 text-green-500 p-0 hover:bg-transparent'
							>
								<ChevronLeft className='h-5 w-5' />
								<span>Back</span>
							</Button>
						</div>
					)}

					<div className='space-y-4 my-4'>
						{currentFolders.length > 0 ? (
							currentFolders.map((folder) => (
								<FolderItem
									key={folder.id}
									folder={folder}
									onClick={() => handleFolderClick(folder)}
								/>
							))
						) : (
							<EmptyState />
						)}
					</div>

					<Button
						onClick={handleMoveConfirm}
						variant='default'
						className='w-full py-6 text-lg bg-black hover:bg-black/90 text-white'
					>
						Move here
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

function FolderItem({
	folder,
	onClick,
}: {
	folder: FolderWithChildren;
	onClick: () => void;
}) {
	return (
		<div
			className='bg-blue-light rounded-md p-4 flex items-center gap-3 cursor-pointer'
			onClick={onClick}
		>
			<FaFolder className='h-6 w-6' />
			<span className='font-medium'>{folder.name || 'Folder'}</span>
		</div>
	);
}

function EmptyState() {
	return (
		<div className='text-center text-gray-500 py-4'>
			No folders in this location
		</div>
	);
}
