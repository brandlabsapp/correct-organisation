'use client';

import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useUserAuth } from '@/contexts/user';
import { useSearchParams } from 'next/navigation';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import { InviteMemberDialog } from './mobile-view/manage-team-form';
import { TeamCard } from './mobile-view/team-card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type TeamMember = {
	id: number;
	name: string;
	email: string;
	role: string;
	invitationToken: string;
	invitedAt: Date;
	lastAccessedAt: Date;
	professionalDetails: {
		directorDin: string;
	};
	status: string;
	acceptedAt: Date;
	companyId: number;
	createdAt: Date;
	deletedAt: Date | null;
	userId: number;
	uuid: string;
	user: AppTypes.User;
};

export const ManageTeam = () => {
	const { user, members, company } = useUserAuth();
	console.log(members);
	const companyId = company?.id;

	const query = useSearchParams();
	const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
	const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

	useEffect(() => {
		if (members) {
			setTeamMembers(members);
		}
	}, [members]);

	const handleAddMember = async (values: any) => {
		if (!company?.id) {
			showErrorToast({ title: 'Error', message: 'Company ID not found.' });
			return;
		}

		try {
			const response = await fetch('/api/profile/team', {
				method: 'POST',
				body: JSON.stringify({
					companyId: companyId,
					phone: values.phone,
					role: values.role,
				}),
			});

			const result = await response.json();
			if (result.success) {
				setTeamMembers([...teamMembers, values]);
			}

			setTeamMembers([...teamMembers, values]);

			showSuccessToast({
				title: 'Success',
				message: 'Team member added successfully!',
			});
		} catch (error) {
			showErrorToast({
				title: 'Error',
				message: 'Failed to add team member.',
			});
		}
	};

	const handleRemoveMember = async (id: string | number | undefined) => {
		if (!id) {
			showErrorToast({ title: 'Error', message: 'Team member ID not found.' });
			return;
		}

		const response = await fetch(`/api/profile/team/${id}`, {
			method: 'DELETE',
		});

		const result = await response.json();
		if (result.success) {
			setTeamMembers(teamMembers.filter((member) => member.id !== id));
		}

		if (!companyId) {
			showErrorToast({ title: 'Error', message: 'Company ID not found.' });
			return;
		}
		showSuccessToast({
			title: 'Success',
			message: 'Team member removed successfully!',
		});

		try {
		} catch (error) {
			showErrorToast({
				title: 'Error',
				message: 'Failed to remove team member.',
			});
		}
	};

	return (
		<div className='space-y-4 py-2'>
			<div className='space-y-4'>
				<Link
					href={`/profile?company=${companyId}`}
					className='flex items-center text-green mb-4'
				>
					<ChevronRight className='w-5 h-5 rotate-180' />
					<span>Back</span>
				</Link>
			</div>
			<h2 className='text-mobile-heading md:text-heading3 font-semibold mb-4'>
				Manage Team
			</h2>
			<div className='space-y-4'>
				{teamMembers.map((member) => (
					<Sheet key={`${member.id}`}>
						<SheetTrigger asChild>
							<div
								className='bg-lightgray rounded-lg h-14 px-4 py-3 flex items-center justify-between cursor-pointer'
								onClick={() => setSelectedMember(member)}
							>
								<div className='flex items-center gap-3'>
									<div className='bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium'>
										{(member.name || member.user?.name || '?').charAt(0)}
									</div>
									<div>
										<div className='font-medium text-black'>
											{member.name || member.user?.name}
										</div>
										<div className='text-sm text-gray-500'>{member.role}</div>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									{member.status === 'Active' || member.status === 'active' ? (
										<span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
											Active
										</span>
									) : (
										<span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>
											Pending
										</span>
									)}
									<MoreVertical className='h-5 w-5 text-gray-500' />
								</div>
							</div>
						</SheetTrigger>

						<SheetContent side='bottom' className='px-0 py-0 bg-white rounded-t-xl'>
							<div className='flex flex-col h-full'>
								<div className='px-6 py-2 flex items-center gap-4 border-b'>
									<div className='bg-gray-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium'>
										{(member.name || member.user?.name || '?').charAt(0)}
									</div>
									<div className='flex items-center space-x-3'>
										<div className='font-medium text-xl'>
											{member.name || member.user?.name}
										</div>
										{member.status === 'Active' || member.status === 'active' ? (
											<span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
												Active
											</span>
										) : (
											<span className='bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded'>
												Pending
											</span>
										)}
									</div>
								</div>
								<TeamCard member={member} />
								{member.userId !== user?.id && member.id !== user?.id && (
									<div className='px-6 py-2 mt-auto'>
										<Button
											variant='ghost'
											className='w-full text-red-500 flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600'
											onClick={() => handleRemoveMember(member.id)}
										>
											<Trash2 className='h-5 w-5' />
											Remove {member.name || member.user?.name}
										</Button>
									</div>
								)}
							</div>
						</SheetContent>
					</Sheet>
				))}
			</div>

			{/* Add member button */}
			<div className='mt-6'>
				<InviteMemberDialog onInviteMember={handleAddMember} />
			</div>
		</div>
	);
};
