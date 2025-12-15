'use client';

import { useState, useMemo, useCallback } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';

type Compliance = {
	id: number;
	formId: string;
	title: string;
	state: string;
	category: string;
	applicability: string;
	purpose: string;
	dueDate: string;
	penalties: string;
	section: string;
	rules: string;
};

interface ComplianceDialogProps {
	allCompliances: Compliance[];
	companyId: string | null;
	handleAddCompliance: (compliance: Compliance[]) => void;
}

export default function ComplianceDialog({
	allCompliances,
	companyId,
	handleAddCompliance,
}: ComplianceDialogProps) {
	const [selectedCompliances, setSelectedCompliances] = useState<number[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const filteredCompliances = useMemo(() => {
		if (!searchTerm) return allCompliances;
		return allCompliances.filter((compliance) =>
			Object.values(compliance).some((val) =>
				val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
			)
		);
	}, [allCompliances, searchTerm]);

	console.log('allCompliances', allCompliances);
	console.log('filteredCompliances', filteredCompliances);

	const selectedComplianceObjects = useMemo(
		() =>
			allCompliances.filter((compliance) =>
				selectedCompliances.includes(compliance.id)
			),
		[allCompliances, selectedCompliances]
	);

	console.log('selectedComplianceObjects', selectedComplianceObjects);

	const handleSearch = useCallback((value: string) => {
		setSearchTerm(value);
	}, []);

	const toggleCompliance = useCallback((id: number) => {
		setSelectedCompliances((prev) =>
			prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
		);
	}, []);

	const handleSaveChanges = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/checklist', {
				method: 'POST',
				body: JSON.stringify({
					companyId: companyId,
					complianceIds: selectedCompliances,
					start: new Date().toISOString(),
					end: new Date().toISOString(),
				}),
			});

			const data = await response.json();
			if (data.success) {
				showSuccessToast({
					title: 'Compliances saved successfully',
					message: data.message,
				});
				handleAddCompliance(selectedComplianceObjects);
				setIsOpen(false);
			} else {
				showErrorToast({
					error: data,
				});
			}
		} catch (error) {
			showErrorToast({
				error,
			});
		}
		setIsLoading(false);
	}, [
		companyId,
		selectedCompliances,
		handleAddCompliance,
		selectedComplianceObjects,
	]);

	const ComplianceListItem = ({ compliance }: { compliance: Compliance }) => (
		<div key={compliance.id} className='flex items-center space-x-2 mb-2'>
			<Checkbox
				id={`${compliance.id}`}
				checked={selectedCompliances.includes(compliance.id)}
				onCheckedChange={() => toggleCompliance(compliance.id)}
				className='bg-lightgray border-black'
			/>
			<label htmlFor={`${compliance.id}`} className='cursor-pointer'>
				{compliance.title || compliance.formId}
			</label>
		</div>
	);

	const SelectedComplianceDetails = ({
		compliance,
	}: {
		compliance: Compliance;
	}) => (
		<li
			key={compliance.id}
			className='bg-lightgray p-4 rounded-lg shadow-sm text-black'
		>
			<h4 className='font-medium text-lg mb-2 text-black'>{compliance.title}</h4>
			<div className='space-y-3 text-sm'>
				<div>
					<span className='font-medium text-gray-600'>State:</span>
					{compliance.state}
				</div>
				<div>
					<span className='font-medium text-gray-600'>Applicability:</span>
					{compliance.applicability}
				</div>
				<div>
					<span className='font-medium text-gray-600'>Purpose:</span>
					{compliance.purpose}
				</div>
				<div>
					<span className='font-medium text-gray-600'>Due Date:</span>
					{compliance.dueDate}
				</div>
				<div>
					<span className='font-medium text-gray-600'>Penalties:</span>
					{compliance.penalties}
				</div>
				<div>
					<span className='font-medium text-gray-600'>Section:</span>
					{compliance.section}
				</div>
				<div className='col-span-2'>
					<span className='font-medium text-gray-600'>Rules:</span>
					{compliance.rules}
				</div>
			</div>
		</li>
	);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='mt-5'>
					Add New Compliances
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-4xl max-h-screen overflow-y-auto bg-lightgray text-black'>
				<DialogHeader>
					<DialogTitle>Compliance Data</DialogTitle>
				</DialogHeader>
				<div className='flex w-full items-center space-x-2 mb-4'>
					<Search className='w-5 h-5 text-gray-400' />
					<Input
						type='search'
						placeholder='Search compliances...'
						value={searchTerm}
						onChange={(e) => handleSearch(e.target.value)}
						className='flex-grow w-full'
						aria-label='Search compliances'
					/>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='border rounded-lg p-4 max-h-96 overflow-y-auto'>
						{filteredCompliances.length === 0 ? (
							<div className='text-gray-500'>No compliances found.</div>
						) : (
							filteredCompliances.map((compliance) => (
								<ComplianceListItem key={compliance.id} compliance={compliance} />
							))
						)}
					</div>
					<div className='border rounded-lg p-4 max-h-96 overflow-y-auto'>
						{selectedComplianceObjects.length === 0 ? (
							<div className='text-gray-500'>No compliances selected.</div>
						) : (
							<div>
								<h3 className='text-lg font-semibold mb-2'>Selected Compliances</h3>
								<ul className='space-y-4'>
									{selectedComplianceObjects.map((compliance) => (
										<SelectedComplianceDetails
											key={compliance.id}
											compliance={compliance}
										/>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
				<div className='flex justify-end mt-4'>
					<Button
						loading={isLoading}
						disabled={isLoading || selectedCompliances.length === 0}
						onClick={handleSaveChanges}
						aria-disabled={isLoading || selectedCompliances.length === 0}
					>
						Save Changes
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
