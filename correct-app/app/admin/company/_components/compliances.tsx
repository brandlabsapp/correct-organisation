'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import ComplianceDialog from './compliance-forms';
// Replaced moment with date-fns for smaller bundle size
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import ComplianceCardList from './compliance-card';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import Tag from '@/components/common/Tag';
import Select from '@/components/common/Select';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';

interface Compliance {
	id: number;
	formId: string;
	title: string;
	status: 'completed' | 'in-progress' | 'not-started';
	startDate: string;
	endDate: string;
	compliance?: {
		formId: string;
		title: string;
		status: 'completed' | 'in-progress' | 'not-started';
		startDate: string;
		endDate: string;
		section: string;
		purpose: string;
		dueDateRule: string;
		penalties: string;
		rules: string;
		applicability: string;
		category: string;
		state: string;
		createdAt: string;
		updatedAt: string;
		uuid: string;
	};
}

interface ComplianceTableMeta {
	editingId: number | null;
	handleEdit: (id: number) => void;
	handleInputChange: (id: number, field: keyof Compliance, value: any) => void;
	handleSave: (id: number) => void;
	handleRemove: (id: number) => void;
}

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends unknown> extends ComplianceTableMeta { }
}

const columns: ColumnDef<Compliance>[] = [
	{
		accessorKey: 'title || formId',
		header: 'Title',
		cell: ({ row, table }) => {
			const compliance = row.original;
			console.log('compliance from columns', compliance);
			const editingId = table.options.meta?.editingId;

			return editingId === compliance.id ? (
				<Input
					value={compliance?.compliance?.title || compliance.compliance?.formId}
					onChange={(e) =>
						table.options.meta?.handleInputChange(
							compliance.id,
							'title',
							e.target.value
						)
					}
				/>
			) : (
				compliance.compliance?.title || compliance.compliance?.formId
			);
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row, table }) => {
			const compliance = row.original;
			const editingId = table.options.meta?.editingId;

			return editingId === compliance.id ? (
				<Select
					options={[
						{ label: 'Completed', value: 'completed' },
						{ label: 'In Progress', value: 'in-progress' },
						{ label: 'Not Started', value: 'not-started' },
					]}
					value={compliance.status}
					onChange={(value) =>
						table.options.meta?.handleInputChange(compliance.id, 'status', value)
					}
					placeholder='Select Status'
				/>
			) : (
				<Tag
					className='text-xs'
					text={
						compliance.status === 'completed'
							? 'Completed'
							: compliance.status === 'in-progress'
								? 'In Progress'
								: 'Not Started'
					}
					color={
						compliance.status === 'completed'
							? 'green'
							: compliance.status === 'in-progress'
								? 'yellow'
								: 'red'
					}
					width='sm'
				/>
			);
		},
	},
	{
		accessorKey: 'startDate',
		header: 'Start Date',
		cell: ({ row, table }) => {
			const compliance = row.original;
			const editingId = table.options.meta?.editingId;

			return editingId === compliance.id ? (
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							className={cn(
								'w-[240px] justify-start text-left font-normal',
								!compliance.startDate && 'text-muted-foreground'
							)}
						>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{compliance.startDate ? (
								format(new Date(compliance.startDate), 'yyyy-MM-dd') // date-fns format
							) : (
								<span>Pick a date</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0'>
						<Calendar
							mode='single'
							selected={new Date(compliance.startDate)}
							onSelect={(date) =>
								table.options.meta?.handleInputChange(
									compliance.id,
									'startDate',
									date ? date.toISOString() : ''
								)
							}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			) : (
				format(new Date(compliance.startDate), 'yyyy-MM-dd') // date-fns format
			);
		},
	},
	{
		accessorKey: 'endDate',
		header: 'End Date',
		cell: ({ row, table }) => {
			const compliance = row.original;
			const editingId = table.options.meta?.editingId;

			return editingId === compliance.id ? (
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							className={cn(
								'w-[240px] justify-start text-left font-normal',
								!compliance.endDate && 'text-muted-foreground'
							)}
						>
							<CalendarIcon className='mr-2 h-4 w-4' />
							{compliance.endDate ? (
								format(new Date(compliance.endDate), 'yyyy-MM-dd') // date-fns format
							) : (
								<span>Pick a date</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-auto p-0'>
						<Calendar
							mode='single'
							selected={new Date(compliance.endDate)}
							onSelect={(date) =>
								table.options.meta?.handleInputChange(
									compliance.id,
									'endDate',
									date ? date.toISOString() : ''
								)
							}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			) : (
				format(new Date(compliance.endDate), 'yyyy-MM-dd') // date-fns format
			);
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row, table }) => {
			const compliance = row.original;
			const editingId = table.options.meta?.editingId;

			return editingId === compliance.id ? (
				<Button
					className='bg-black text-white'
					onClick={() => table.options.meta?.handleSave(compliance.id)}
				>
					Save
				</Button>
			) : (
				<div className='flex gap-2'>
					<Button
						variant='outline'
						onClick={() => table.options.meta?.handleEdit(compliance.id)}
					>
						Edit
					</Button>
					<Button
						variant='default'
						onClick={() => table.options.meta?.handleRemove(compliance.id)}
					>
						Remove
					</Button>
				</div>
			);
		},
	},
];

export function Compliances({
	checklist,
	allCompliances,
	companyId,
}: {
	checklist: any;
	allCompliances: any;
	companyId: string | null;
}) {
	const [compliances, setCompliances] = useState<Compliance[]>(checklist);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [newCompliance, setNewCompliance] = useState<Omit<Compliance, 'id'>>({
		formId: '',
		title: '',
		status: 'not-started',
		startDate: '',
		endDate: '',
	});

	const handleEdit = (id: number) => {
		setEditingId(id);
	};

	const handleSave = async (id: number) => {
		try {
			setEditingId(null);

			const response = await fetch(`/api/admin/checklist/${id}`, {
				method: 'PATCH',
				body: JSON.stringify({
					status: compliances.find((compliance) => compliance.id === id)?.status,
					startDate: compliances.find((compliance) => compliance.id === id)
						?.startDate,
					endDate: compliances.find((compliance) => compliance.id === id)?.endDate,
				}),
			});
			const data = await response.json();
			if (data.success) {
				showSuccessToast({
					title: 'Success',
					message: 'Compliance updated successfully',
				});
			}
		} catch (error) {
			showErrorToast(error as Error);
		}
	};

	const handleInputChange = (
		id: number,
		field: keyof Compliance,
		value: string
	) => {
		setCompliances((prev) =>
			prev.map((compliance) =>
				compliance.id === id ? { ...compliance, [field]: value } : compliance
			)
		);
	};

	const handleAddCompliance = (compliance: any[]) => {
		const newCompliances = compliance.map((item) => ({
			...item,
			title: item.title,
			formId: item.formId,
			status: 'not-started',
			startDate: new Date().toISOString(),
			endDate: new Date().toISOString(),
		}));
		setCompliances((prev) => [...prev, ...newCompliances]);
		setNewCompliance({
			title: newCompliances[0].title,
			formId: newCompliances[0].formId,
			status: 'not-started',
			startDate: '',
			endDate: '',
		});
	};

	const handleRemove = async (id: number) => {
		setCompliances((prev) => prev.filter((compliance) => compliance.id !== id));
		const response = await fetch(`/api/admin/checklist/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		});
		const data = await response.json();
		if (data.success) {
			showSuccessToast({
				title: 'Success',
				message: 'Compliance removed successfully',
			});
		} else {
			showErrorToast({
				title: 'Error',
				message: 'Failed to remove compliance',
			});
		}
	};

	return (
		<div className='mx-auto min-h-screen bg-white mt-5'>
			<div className='hidden md:block'>
				<DataTable
					columns={columns}
					data={compliances}
					meta={{
						editingId,
						handleEdit,
						handleInputChange,
						handleSave,
						handleRemove,
					}}
				/>
			</div>
			<ComplianceCardList
				compliances={compliances}
				editingId={editingId}
				handleSave={handleSave}
				handleEdit={handleEdit}
				handleRemove={handleRemove}
				handleInputChange={handleInputChange}
			/>
			<ComplianceDialog
				allCompliances={allCompliances}
				companyId={companyId}
				handleAddCompliance={handleAddCompliance}
			/>
		</div>
	);
}
