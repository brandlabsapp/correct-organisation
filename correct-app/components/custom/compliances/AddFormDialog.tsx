'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { ComplianceForm } from './ComplianceForm';
import { CompanyForm } from './table/column';
import { PlusIcon } from 'lucide-react';

interface AddFormDialogProps {
	onAddForm: (form: CompanyForm) => void;
	serialNo: number;
}

export function AddFormDialog({ onAddForm, serialNo }: AddFormDialogProps) {
	const [open, setOpen] = useState(false);

	const handleAddForm = (form: CompanyForm) => {
		onAddForm(form);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='bg-white'>
					<PlusIcon className='w-4 h-4' />
					Add New Form
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[500px] bg-white'>
				<DialogHeader>
					<DialogTitle>Add New Company Form</DialogTitle>
					<DialogDescription>
						Fill in the details of the new company form. Click save when you are done.
					</DialogDescription>
				</DialogHeader>
				<ComplianceForm onAddForm={handleAddForm} serialNo={serialNo} />
			</DialogContent>
		</Dialog>
	);
}
