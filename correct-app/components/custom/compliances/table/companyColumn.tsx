import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export type Company = {
	id: number;
	uuid: string;
	cin: string;
	pan: string;
	gst: string;
	name: string;
	address: string;
	industry: string;
	size: string;
	teamSize: number;
	userId: number;
};

export const companyColumns: ColumnDef<Company>[] = [
	{
		accessorKey: 'name',
		header: 'Company Name',
		cell: ({ row }) => {
			const name = row.original.name;
			return <div className='min-w-[200px] font-bold'>{name}</div>;
		},
	},
	{
		accessorKey: 'cin',
		header: 'CIN',
		cell: ({ row }) => {
			const cin = row.original.cin;
			return <div className='min-w-[200px] text-center font-bold'>{cin}</div>;
		},
	},
	{
		accessorKey: 'pan',
		header: 'PAN',
		cell: ({ row }) => {
			const pan = row.original.pan;
			return <div className='min-w-[200px]'>{pan}</div>;
		},
	},
	{
		accessorKey: 'gst',
		header: 'GST',
		cell: ({ row }) => {
			const gst = row.original.gst;
			return <div className='min-w-[200px]'>{gst}</div>;
		},
	},
	{
		accessorKey: 'address',
		header: 'Address',
		cell: ({ row }) => {
			const address = row.original.address;
			return <div className='min-w-[300px]'>{address}</div>;
		},
	},
	{
		accessorKey: 'industry',
		header: 'Industry',
		cell: ({ row }) => {
			const industry = row.original.industry;
			return <div className='min-w-[200px]'>{industry}</div>;
		},
	},
	{
		accessorKey: 'size',
		header: 'Size',
		cell: ({ row }) => {
			const size = row.original.size;
			return <div className='min-w-[200px]'>{size}</div>;
		},
	},
	{
		accessorKey: 'teamSize',
		header: 'Team Size',
		cell: ({ row }) => {
			const teamSize = row.original.teamSize;
			return <div className='min-w-[200px]'>{teamSize}</div>;
		},
	},
	{
		header: 'Manage Company',
		cell: ({ row }) => {
			const company = row.original;
			return (
				<Link href={`/admin/company/${company.id}`} prefetch={false}>
					<Button>Manage Company</Button>
				</Link>
			);
		},
	},
];
