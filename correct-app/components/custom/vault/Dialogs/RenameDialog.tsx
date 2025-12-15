import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogFooter,
	DialogTitle,
	DialogContent,
	DialogHeader,
	DialogClose,
} from '@/components/ui/dialog';
import React from 'react';
import { Input } from '@/components/ui/input';

type Props = {
	title: string;
	placeholder: string;
	isRenameDialogOpen: boolean;
	setIsRenameDialogOpen: (isOpen: boolean) => void;
	newFolderName: string;
	setNewFolderName: (name: string) => void;
	handleRenameSubmit: () => void;
};

const RenameDialog = ({
	title,
	placeholder,
	isRenameDialogOpen,
	setIsRenameDialogOpen,
	newFolderName,
	setNewFolderName,
	handleRenameSubmit,
}: Props) => {
	return (
		<div>
			<Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>
					<Input
						type='text'
						placeholder={placeholder}
						value={newFolderName}
						onChange={(e) => setNewFolderName(e.target.value)}
						className='input'
					/>
					<DialogFooter>
						<Button onClick={handleRenameSubmit}>OK</Button>
						<DialogClose asChild>
							<Button>Cancel</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default RenameDialog;
