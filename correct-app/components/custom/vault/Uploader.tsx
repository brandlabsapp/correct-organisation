import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Plus } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { FaFolder } from 'react-icons/fa';
import { FaUpload } from 'react-icons/fa6';
import { BsFileEarmarkCheckFill } from 'react-icons/bs';
import { Input } from '@/components/ui/input';
import InputModal from '@/components/common/Modals/InputModal';
import { showLoadingToast } from '@/lib/utils/toast-handlers';

type Props = {
	handleFileUpload: (file: File) => void;
	handleCreateFolder: (folderName: string) => void;
};

const Uploader = ({ handleFileUpload, handleCreateFolder }: Props) => {
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
	const [folderName, setFolderName] = useState('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	const onCreateFolder = () => {
		if (folderName.trim()) {
			handleCreateFolder(folderName);
			setFolderName('');
			setIsFolderDialogOpen(false);
			setIsSheetOpen(false);
		}
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			handleFileUpload(file);
			setIsSheetOpen(false);

			showLoadingToast({
				title: 'Uploading...',
				message: 'Please wait while we upload the file...',
			});

			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<>
			<Input
				type='file'
				ref={fileInputRef}
				onChange={handleFileSelect}
				className='hidden'
				accept='*/*'
			/>
			<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
				<SheetTrigger asChild>
					<Button
						className='fixed bottom-20 right-4 md:bottom-24 md:right-8 text-xs md:text-sm rounded-full shadow-lg'
						size='sm'
						variant='lightBlue'
					>
						<Plus className='h-4 w-4 md:h-6 md:w-6 mr-1 md:mr-2' />
						New
					</Button>
				</SheetTrigger>
				<SheetContent side='bottom' className='rounded-t-xl bg-white' hideCloseIcon>
					<div className='flex flex-col space-y-4 pt-5 px-1'>
						<div
							className='bg-blue-light flex items-center space-x-2 rounded-lg p-4 cursor-pointer'
							onClick={() => {
								setIsFolderDialogOpen(true);
								setIsSheetOpen(false);
							}}
						>
							<FaFolder className='min-h-4 min-w-4 text-gray-dark' />
							<p className='text-gray-dark text-body3 font-medium'>
								Create New Folder
							</p>
						</div>
						<div
							className='bg-blue-light flex items-center space-x-2 rounded-lg p-4 cursor-pointer'
							onClick={triggerFileInput}
						>
							<FaUpload className='min-h-4 w-4 text-gray-dark' />
							<p className='text-gray-dark text-body3 font-medium'>Upload Files</p>
						</div>
						<div className='bg-blue-light flex items-center space-x-2 rounded-lg p-4'>
							<BsFileEarmarkCheckFill className='min-h-4 w-4 text-gray-dark' />
							<p className='text-gray-dark text-body3 font-medium'>
								Create New Invoice
							</p>
						</div>
					</div>
				</SheetContent>
			</Sheet>
			<InputModal
				open={isFolderDialogOpen}
				onOpenChange={setIsFolderDialogOpen}
				placeholder='New Folder'
				buttonText='Create new folder'
				onClick={onCreateFolder}
				title='Folder Name'
				value={folderName}
				setValue={setFolderName}
			/>
		</>
	);
};

export default Uploader;
