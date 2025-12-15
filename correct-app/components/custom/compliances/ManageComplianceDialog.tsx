'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';

interface ComplianceDialogProps {
	company: any;
	initialComplianceData: any;
}

export function ManageComplianceDialog({
	company,
	initialComplianceData,
}: ComplianceDialogProps) {
	const [selectedCompliances, setSelectedCompliances] = useState<number[]>([]);

	const handleSave = () => {
		// Handle saving the selected compliances
	};

	const handleSelectCompliance = (compliance: any) => {
		setSelectedCompliances((prev) =>
			prev.includes(compliance.srNo)
				? prev.filter((id) => id !== compliance.srNo)
				: [...prev, compliance.srNo]
		);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline' size='sm'>
					Manage Compliances
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-2xl'>
				<DialogHeader className='pb-4 border-b'>
					<DialogTitle>Manage Compliances for {company}</DialogTitle>
					<DialogDescription>
						Select the compliances that apply to this company.
					</DialogDescription>
				</DialogHeader>
				<div className='my-6 max-h-[400px] overflow-y-auto pr-4'>
					<div className='space-y-4'>
						{initialComplianceData.map((compliance: any) => (
							<div
								key={compliance.srNo}
								className='flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
							>
								<Checkbox
									id={`compliance-${compliance.srNo}`}
									checked={selectedCompliances.includes(compliance.srNo)}
									onCheckedChange={() => {
										handleSelectCompliance(compliance);
									}}
									className='mt-1'
								/>
								<div className='space-y-1'>
									<label
										htmlFor={`compliance-${compliance.srNo}`}
										className='text-sm font-medium leading-none cursor-pointer'
									>
										{compliance.formName}
									</label>
									<p className='text-sm text-muted-foreground'>{compliance.purpose}</p>
								</div>
							</div>
						))}
					</div>
				</div>
				<DialogFooter className='pt-4 border-t'>
					<Button variant='outline' type='button'>
						Cancel
					</Button>
					<Button onClick={handleSave}>Save Changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
