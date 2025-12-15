import { ColumnDef } from '@tanstack/react-table';

interface CSVRow {
	srNo?: string;
	title: string;
	state: string;
	category: string;
	applicability: string;
	purpose: string;
	dueDateRule: string;
	penalties: string;
	section?: string;
	rules?: string;
	startDate?: string;
	endDate?: string;
}

export const complianceCsvColumns: ColumnDef<CSVRow>[] = [
	{ accessorKey: 'srNo', header: 'Sr. No.' },
	{
		accessorKey: 'title',
		header: 'Title',
		cell: ({ row }) => (
			<span className='truncate' title={row.original.title}>
				{row.original.title}
			</span>
		),
	},
	{ accessorKey: 'state', header: 'State' },
	{ accessorKey: 'category', header: 'Category' },
	{
		accessorKey: 'applicability',
		header: 'Applicability',
		cell: ({ row }) => (
			<span className='truncate' title={row.original.applicability}>
				{row.original.applicability}
			</span>
		),
	},
	{
		accessorKey: 'purpose',
		header: 'Purpose',
		cell: ({ row }) => (
			<span className='truncate' title={row.original.purpose}>
				{row.original.purpose}
			</span>
		),
	},
	{
		accessorKey: 'dueDateRule',
		header: 'Due Date Rule',
		cell: ({ row }) => (
			<span className='truncate' title={row.original.dueDateRule}>
				{row.original.dueDateRule}
			</span>
		),
	},
	{
		accessorKey: 'penalties',
		header: 'Penalties',
		cell: ({ row }) => (
			<span className='truncate' title={row.original.penalties}>
				{row.original.penalties}
			</span>
		),
	},
];
