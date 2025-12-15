import { useState } from 'react';
import { FaFolder } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { FolderActionSheet } from './FolderActionSheet';
import InputModal from '@/components/common/Modals/InputModal';
import StatusModal from '@/components/common/Modals/StatusModal';

type Props = {
	folder: vault.Folder;
	handleFolderClick: (folder: vault.Folder) => void;
	handleDeleteFolder: (folder: vault.Folder) => void;
	handleRenameFolder: (folder: vault.Folder, newName: string) => void;
	handleMoveFolder?: (folder: vault.Folder) => void;
	handleShareFolder?: (folder: vault.Folder) => void;
};

const Folder = ({
	folder,
	handleFolderClick,
	handleDeleteFolder,
	handleRenameFolder,
	handleMoveFolder,
	handleShareFolder,
}: Props) => {
	const [newFolderName, setNewFolderName] = useState(folder.name);
	const [renameDialogOpen, setRenameDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleConfirmDelete = () => {
		handleDeleteFolder(folder);
		setDeleteDialogOpen(false);
	};

	const handleRenameClick = () => {
		setNewFolderName(folder.name);
		setRenameDialogOpen(true);
	};

	const handleConfirmRename = () => {
		if (newFolderName.trim() !== '') {
			handleRenameFolder(folder, newFolderName);
			setRenameDialogOpen(false);
		}
	};

	const handleDeleteClick = () => {
		setDeleteDialogOpen(true);
	};

	return (
		<div className='flex items-center space-x-3 justify-between p-4 md:p-5 lg:p-6 bg-lightgray rounded-lg mb-2 md:mb-3 transition-colors hover:bg-lightgray-light cursor-pointer'>
			<div
				className='flex items-center gap-3 md:gap-4 flex-1 cursor-pointer min-w-0'
				onClick={() => handleFolderClick(folder)}
			>
				<FaFolder className='min-h-4 min-w-4 md:min-h-5 md:min-w-5 text-secondarygray-dark' />
				<h3 className='text-body3 md:text-body2 font-medium text-gray-700 truncate'>
					{folder.name}
				</h3>
			</div>

			<div className='cursor-pointer' onClick={(e) => e.stopPropagation()}>
				<FolderActionSheet
					folderName={folder.name}
					createdAt={folder.createdAt}
					itemCount={folder.itemCount}
					onRename={handleRenameClick}
					onDelete={handleDeleteClick}
				/>
			</div>
			{renameDialogOpen && (
				<InputModal
					open={renameDialogOpen}
					onOpenChange={setRenameDialogOpen}
					placeholder='Enter new folder name'
					buttonText='Rename'
					onClick={handleConfirmRename}
					title='Rename Folder'
					value={newFolderName}
					setValue={setNewFolderName}
				/>
			)}
			{deleteDialogOpen && (
				<StatusModal
					title='Delete Folder'
					message={`Are you sure you want to delete this folder?`}
					status='error'
					buttonText='Delete'
					onButtonClick={handleConfirmDelete}
					open={deleteDialogOpen}
					setOpen={setDeleteDialogOpen}
				/>
			)}
		</div>
	);
};

export default Folder;
