'use client';

import Markdown from '@/components/common/Markdown';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';

export type CompanyForm = {
	srNo: number;
	title: string;
	state: string;
	category: string;
	applicability: string;
	purpose: string;
	dueDateRule: string;
	penalties: string;
	section: string;
	rules: string;
};

export const columns: ColumnDef<CompanyForm>[] = [
	{
		header: 'Sr. No.',
		cell: ({ row }) => {
			const id = row.index + 1;
			return <div className='text-center'>{id}</div>;
		},
		sortingFn: 'basic',
		sortDescFirst: true,
	},
	{
		header: 'Title',
		cell: ({ row }) => {
			const name = row.original.title;
			return <div className='min-w-[200px] font-bold'>{name}</div>;
		},
		sortingFn: 'text',
		sortDescFirst: true,
		sortUndefined: 'last',
	},
	{
		accessorKey: 'state',
		header: 'State',
		cell: ({ row }) => {
			const state = row.original.state;
			return <div className='min-w-[50px]'>{state}</div>;
		},
		sortingFn: 'text',
		sortUndefined: 'last',
	},
	{
		accessorKey: 'category',
		header: 'Category',
		cell: ({ row }) => {
			const category = row.original.category;
			return (
				<Badge className='bg-blue text-black min-w-fit shadow-none' width='full'>
					{category}
				</Badge>
			);
		},
		sortingFn: 'text',
		sortUndefined: 'last',
	},
	{
		accessorKey: 'applicability',
		header: 'Applicability',
		cell: ({ row }) => {
			const applicability = row.original.applicability;
			return <div className='min-w-[200px]'>{applicability}</div>;
		},
		sortingFn: 'text',
		sortUndefined: 'last',
	},
	{
		accessorKey: 'purpose',
		header: 'Purpose',
		cell: ({ row }) => {
			const purpose = row.original.purpose;
			return <div className='min-w-[200px]'>{purpose}</div>;
		},
		sortingFn: 'text',
		sortUndefined: 'last',
	},
	{
		accessorKey: 'dueDate',
		header: 'Due Date',
		cell: ({ row }) => {
			const dueDateRule = row.original.dueDateRule;
			return <div className='min-w-[200px]'>{dueDateRule}</div>;
		},
		sortingFn: 'text',
		sortUndefined: 'last',
	},
	{
		accessorKey: 'penalties',
		header: 'Penalties',
		cell: ({ row }) => {
			const penalties = row.original.penalties;
			return <div className='min-w-[300px] text-red'>{penalties}</div>;
		},
		sortingFn: 'text',
		sortUndefined: 'last',
	},
	{
		accessorKey: 'section',
		header: 'Legal Section',
		cell: ({ row }) => {
			const section = row.original.section;
			return <div className='min-w-[200px]'>{section}</div>;
		},
		sortingFn: 'text',
		sortUndefined: 'last',
	},
	{
		accessorKey: 'rules',
		header: 'Rules',
		cell: ({ row }) => {
			const rules = row.original.rules;
			return (
				<div className='min-w-[400px]'>
					<Markdown content={rules} />
				</div>
			);
		},
		sortingFn: 'text',
		sortUndefined: 'last',
	},
];
