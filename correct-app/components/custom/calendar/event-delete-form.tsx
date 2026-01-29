'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { showErrorToast } from '@/lib/utils/toast-handlers';

interface EventDeleteFormProps {
	id?: string;
	title?: string;
}

export function EventDeleteForm({ id, title }: EventDeleteFormProps) {
	const [open, setOpen] = useState(false);
	const [eventViewOpen, setEventViewOpen] = useState(false);
	const { toast } = useToast();

	const deleteEvent = async (id: string) => {
		const response = await fetch(`/api/checklist/${id}`, {
			method: 'DELETE',
		});
		const result = await response.json();
		if (result.state === 'error') {
			showErrorToast({
				title: 'Error deleting event!',		
				message: result.message,
			});
			return;
		}
		toast({
			title: 'Event deleted!',
			description: 'Event deleted successfully',
		});
		setOpen(false);
		setEventViewOpen(false);
	};

	async function onSubmit() {
		deleteEvent(id!);
		setOpen(false);
		setEventViewOpen(false);
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogTrigger asChild>
				<Button variant='destructive' onClick={() => setOpen(true)}>
					Delete Event
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle className='flex flex-row justify-between items-center'>
						<h1>Delete {title}</h1>
					</AlertDialogTitle>
					Are you sure you want to delete this event?
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={() => setOpen(false)}>
						Cancel
					</AlertDialogCancel>
					<Button variant='destructive' onClick={() => onSubmit()}>
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
