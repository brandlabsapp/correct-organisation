'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/common/DataTable';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import * as z from 'zod';
import TeamMembersList from './member-card';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import Tag from '@/components/common/Tag';

const formSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	phone: z.string().min(1, 'Phone number is required'),
	role: z.enum(['admin', 'member']).default('member'),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamMember {
	id: number;
	name: string;
	phone: string;
	role: string;
	status: string;
	user?: {
		name: string;
		phone: string;
	};
}

export function TeamMembers({ members }: { members: TeamMember[] }) {
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>(members);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const params = useParams();
	const companyId = params.slug;

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		getValues,
		reset,
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			phone: '',
			role: 'member',
		},
	});

	const handleAddMember = async (values: FormValues) => {
		try {
			const response = await fetch('/api/profile/team', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					phone: values.phone,
					role: values.role,
					companyId: parseInt(companyId as string),
					status: 'pending',
					name: values.name,
				}),
			});

			const data = await response.json();

			if (!data.success) {
				showErrorToast({
					error: data,
				});
			}

			setTeamMembers((prev) => [
				...prev,
				{
					id: prev.length + 1,
					name: values.name,
					phone: values.phone,
					role: values.role,
					status: 'pending',
				},
			]);

			showSuccessToast({
				title: 'Success',
				message: 'Team member added successfully',
			});

			reset();
			setIsDialogOpen(false);
		} catch (error) {
			showErrorToast({
				error,
			});
		}
	};

	const handleEdit = async (id: number, updatedData: Partial<TeamMember>) => {
		try {
			const response = await fetch(`/api/admin/company/members/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedData),
			});

			const data = await response.json();

			if (!data.success) {
				showErrorToast({
					error: data,
				});
				return;
			}

			setTeamMembers((prev) =>
				prev.map((member) =>
					member.id === id ? { ...member, ...updatedData } : member
				)
			);

			showSuccessToast({
				title: 'Success',
				message: 'Team member updated successfully',
			});
		} catch (error) {
			showErrorToast({
				error,
			});
		}
	};

	const columns = [
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }: { row: any }) =>
				row.original.user?.name || row.original.name,
		},
		{
			accessorKey: 'phone',
			header: 'Phone',
			cell: ({ row }: { row: any }) =>
				row.original.user?.phone || row.original.phone,
		},
		{
			accessorKey: 'role',
			header: 'Role',
			cell: ({ row }: { row: any }) => (
				<Select
					value={row.original.role}
					onValueChange={(value) => handleEdit(row.original.id, { role: value })}
				>
					<SelectTrigger>
						<SelectValue>{row.original.role}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='admin'>Admin</SelectItem>
						<SelectItem value='member'>Member</SelectItem>
					</SelectContent>
				</Select>
			),
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }: { row: any }) => (
				<div className='flex items-center gap-2'>
					<Tag
						className={`capitalize text-xs`}
						color={row.original.status === 'pending' ? 'beige' : 'default'}
						text={row.original.status}
						width='sm'
					/>
				</div>
			),
		},
	];

	return (
		<div className='space-y-6 min-h-screen bg-white'>
			<div className='mt-5'>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button>Add New Member</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Team Member</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit(handleAddMember)} className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='name'>Name</Label>
								<Input id='name' {...register('name')} />
								{errors.name && (
									<span className='text-red-500 text-sm'>{errors.name.message}</span>
								)}
							</div>
							<div className='space-y-2'>
								<Label htmlFor='phone'>Phone</Label>
								<Input id='phone' {...register('phone')} />
								{errors.phone && (
									<span className='text-red-500 text-sm'>{errors.phone.message}</span>
								)}
							</div>
							<div className='space-y-2'>
								<Label htmlFor='role'>Role</Label>
								<Select
									onValueChange={(value) =>
										setValue('role', value as 'admin' | 'member')
									}
									defaultValue={getValues('role')}
								>
									<SelectTrigger>
										<SelectValue placeholder='Select role' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='admin'>Admin</SelectItem>
										<SelectItem value='member'>Member</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button type='submit' disabled={isSubmitting}>
								Add Member
							</Button>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className='hidden p-5 md:block'>
				<DataTable columns={columns} data={teamMembers} />
			</div>
			<TeamMembersList teamMembers={teamMembers} handleEdit={handleEdit} />
		</div>
	);
}
