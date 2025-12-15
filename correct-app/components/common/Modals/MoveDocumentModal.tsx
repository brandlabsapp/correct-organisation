import { Button } from '@/components/ui/button';
import {
	DialogTitle,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTrigger,
} from '@/components/ui/dialog';

import React, { useEffect, useState } from 'react';
import { FaFolder } from 'react-icons/fa';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserAuth } from '@/contexts/user';

interface FolderWithChildren extends vault.Folder {
	childFolders?: FolderWithChildren[];
}

type Props = {
	document: vault.Document;
	folders: FolderWithChildren[];
	isOpenMove: boolean;
	setIsOpenMove: (isOpen: boolean) => void;
	selectedFolder: FolderWithChildren | null;
	setSelectedFolder: (folder: FolderWithChildren | null) => void;
	handleMoveDocument: () => void;
};

const MoveDocumentModal = ({
	document,
	folders: propFolders,
	isOpenMove,
	setIsOpenMove,
	selectedFolder,
	setSelectedFolder,
	handleMoveDocument,
}: Props) => {
	const { company } = useUserAuth();
	const [currentFolder, setCurrentFolder] = useState<FolderWithChildren | null>(
		null
	);
	const [folderHistory, setFolderHistory] = useState<FolderWithChildren[]>([]);
	const [displayFolders, setDisplayFolders] = useState<FolderWithChildren[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [allFolders, setAllFolders] = useState<FolderWithChildren[]>([]);

	useEffect(() => {
		if (!isOpenMove) return;

		const fetchAllFolders = async () => {
			setIsLoading(true);
			try {
				const response = await fetch(`/api/vault/folders?companyId=${company?.id}`);
				const data = await response.json();

				if (data.success) {
					setAllFolders(data.data || []);
				} else {
					console.error('Failed to fetch all folders:', data.message);
					setAllFolders(propFolders);
				}
			} catch (error) {
				console.error('Error fetching all folders:', error);
				setAllFolders(propFolders);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAllFolders();
	}, [isOpenMove, company?.id, propFolders]);

	useEffect(() => {
		if (!allFolders.length) return;

		setIsLoading(true);
		try {
			const rootFolders = allFolders.filter((folder) => folder.parentId === null);
			setDisplayFolders(rootFolders);
		} catch (error) {
			console.error('Error loading folders:', error);
		} finally {
			setIsLoading(false);
		}
	}, [allFolders]);

	useEffect(() => {
		if (!allFolders.length) return;

		if (currentFolder) {
			const childFolders = allFolders.filter(
				(f) => f.parentId === currentFolder.id
			);
			setDisplayFolders(childFolders);
		} else {
			const rootFolders = allFolders.filter((f) => f.parentId === null);
			setDisplayFolders(rootFolders);
		}
	}, [currentFolder, allFolders]);

	const handleFolderClick = (folder: FolderWithChildren) => {
		setSelectedFolder(folder);
	};

	const handleFolderDoubleClick = (folder: FolderWithChildren) => {
		if (currentFolder) {
			setFolderHistory([...folderHistory, currentFolder]);
		}
		setCurrentFolder(folder);
		setSelectedFolder(null);
	};

	const handleBack = () => {
		if (folderHistory.length > 0) {
			const newHistory = [...folderHistory];
			const previousFolder = newHistory.pop();
			setFolderHistory(newHistory);
			setCurrentFolder(previousFolder || null);
		} else {
			setCurrentFolder(null);
			setFolderHistory([]);
		}
		setSelectedFolder(null);
	};

	const currentLocation = currentFolder
		? `Current Location: ${currentFolder?.name}`
		: 'Current Location: Root';

	return (
		<Dialog open={isOpenMove} onOpenChange={setIsOpenMove}>
			<DialogTrigger asChild>
				<button className='hidden'></button>
			</DialogTrigger>
			<DialogContent className='rounded-xl bg-white min-h-[400px] max-w-[400px] p-5 flex flex-col'>
				<DialogHeader>
					<DialogTitle className='text-heading4 font-bold text-black'>
						Move File
					</DialogTitle>
					<p className='text-body3 text-gray-600 mt-2'>{currentLocation}</p>
				</DialogHeader>

				{(currentFolder || folderHistory.length > 0) && (
					<button
						onClick={handleBack}
						className='flex items-center text-green-500 gap-1 mt-2 cursor-pointer'
					>
						<ChevronLeft className='h-4 w-4' />
						<span>Back</span>
					</button>
				)}

				<div className='flex flex-col space-y-2 overflow-y-auto flex-1 mt-4'>
					{isLoading ? (
						<div className='text-center py-4 text-gray-500 flex justify-center items-center'>
							<Loader2 className='h-4 w-4 animate-spin mr-2' />
							Loading folders...
						</div>
					) : (
						<>
							{displayFolders.length === 0 ? (
								<div className='text-center py-4 text-gray-500'>
									No folders found in this location
								</div>
							) : (
								displayFolders.map((folder) => (
									<div
										key={folder.id}
										onClick={() => handleFolderClick(folder)}
										onDoubleClick={() => handleFolderDoubleClick(folder)}
										className={cn(
											'flex items-center gap-2 p-4 rounded-lg cursor-pointer bg-lightgray hover:bg-lightgray-light transition-colors',
											selectedFolder?.id === folder.id && 'ring-2 ring-green-500'
										)}
									>
										<FaFolder className='w-5 h-5 text-yellow-500' />
										<p className='text-body3 font-medium text-black truncate'>
											{folder.name}
										</p>
									</div>
								))
							)}
						</>
					)}
				</div>

				<Button
					className='w-full mt-4 bg-black text-white'
					disabled={!selectedFolder}
					onClick={handleMoveDocument}
				>
					Move here
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default MoveDocumentModal;
