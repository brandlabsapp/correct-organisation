import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogFooter,
	DialogDescription,
	DialogTitle,
	DialogContent,
	DialogHeader,
	DialogClose,
} from '@/components/ui/dialog';
import React from 'react';

type Props = {
	isDeleteDialogOpen: boolean;
	setIsDeleteDialogOpen: (isOpen: boolean) => void;
	handleDeleteSubmit: () => void;
};

const DeleteDialog = ({
	isDeleteDialogOpen,
	setIsDeleteDialogOpen,
	handleDeleteSubmit,
}: Props) => {
	return (
		<div>
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
					</DialogHeader>
					<DialogDescription>
						Are you sure you want to delete this folder?
					</DialogDescription>
					<DialogFooter>
						<Button onClick={handleDeleteSubmit}>Yes</Button>
						<DialogClose asChild>
							<Button>No</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DeleteDialog;
