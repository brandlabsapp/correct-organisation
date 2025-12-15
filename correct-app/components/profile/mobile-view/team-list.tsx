import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';

type Props = {
	teamMembers: any[];
	user: any;
	handleRemoveMember: (id: number | undefined) => void;
	isLoading: boolean;
};

const TeamMembersList = ({
	teamMembers,
	user,
	handleRemoveMember,
	isLoading,
}: Props) => {
	return (
		<div className='space-y-4 mt-6 max-h-[500px] overflow-y-auto scrollbar-hide'>
			{teamMembers.map((member, index) => (
				<Card key={index} className='border border-border'>
					<CardContent className='p-4 space-y-2'>
						<div className='flex justify-between items-center mb-4'>
							<span className='font-medium'>{member.name || member.user?.name}</span>
							{member.userId !== user?.id && (
								<Button
									variant='destructive'
									size='xs'
									onClick={() => handleRemoveMember(member.id)}
								>
									{'Remove'}
								</Button>
							)}
						</div>
						<div className='grid grid-cols-4 space-y-1 text-xs'>
							<div className='text-muted-foreground'>Phone</div>
							<div className='col-span-3'>{member.phone || member.user?.phone}</div>
							<div className='text-muted-foreground'>Email</div>
							<div className='col-span-3 break-all'>
								{member.email || member.user?.email}
							</div>
							<div className='text-muted-foreground'>Role</div>
							<div className='col-span-3'>
								{member.role === 'admin' ? 'Admin' : 'Member'}
							</div>
							<div className='text-muted-foreground'>Status</div>
							<div className='col-span-3'>
								<span
									className={`inline-flex items-center rounded-full py-1 text-center text-xs font-medium ${
										member.status === 'active'
											? 'bg-green-50 text-green-700'
											: 'bg-gray-100 text-gray-700'
									}`}
								>
									{member.status === 'active' ? 'Active' : 'Pending'}
								</span>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default TeamMembersList;
