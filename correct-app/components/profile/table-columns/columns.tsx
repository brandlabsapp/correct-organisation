import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type TeamMembers = {
	id?: number;
	name: string;
	email: string;
	role: string;
	status: string;
	user?: any;
	userId?: number;
	phone?: string;
};

export const getColumns = (
	handleRemoveMember: (id: number | undefined) => void,
	user: any,
	isLoading: boolean
): ColumnDef<TeamMembers>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			const name = row.original.user?.name || row.original.name || 'N/A';
			return <div>{name}</div>;
		},
		enableSorting: false,
	},
	{
		accessorKey: 'phone',
		header: 'Phone',
		cell: ({ row }) => {
			const phone = row.original.user?.phone || row.original.phone || 'N/A';
			return <div>{phone}</div>;
		},
		enableSorting: false,
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => {
			const role = row.original.user?.email || row.original.email || 'N/A';
			return <div>{role}</div>;
		},
		enableSorting: false,
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }) => {
			const role = row.original.role;
			return <div>{role === 'member' ? 'Member' : 'Admin'}</div>;
		},
		enableSorting: false,
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<div
					className={cn(
						'w-fit px-3 py-1 rounded-md',
						status === 'active'
							? 'bg-green-100 text-green-800'
							: 'bg-yellow-100 text-yellow-800'
					)}
				>
					{status === 'active' ? 'Active' : 'Pending'}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		header: 'Action',
		cell: ({ row }) => {
			const member = row.original;
			return (
				<>
					{member.userId !== user?.id ? (
						<Button
							variant='destructive'
							// loading={isLoading}
							onClick={() => handleRemoveMember(member?.id)}
						>
							{'Remove'}
						</Button>
					) : (
						<Button variant='destructive' disabled>
							Remove
						</Button>
					)}
				</>
			);
		},
		enableSorting: false,
	},
];
