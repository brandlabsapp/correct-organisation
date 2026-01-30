'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { TeamInviteForm } from '../team-invite-form';

export function InviteMemberDialog({
	onInviteMember,
}: {
	onInviteMember: (values: any) => Promise<void>;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full' variant='lightgray'>
					<Plus className='w-4 h-4 mr-2' />
					Invite Team Member
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-[500px] md:min-h-[300px] text-sm md:text-base min-h-[200px] bg-white rounded-xl'>
				<DialogHeader>
					<DialogTitle>Invite New Team Member</DialogTitle>
				</DialogHeader>
				<TeamInviteForm
					onSubmit={async (values) => {
						await onInviteMember(values);
						setIsOpen(false);
					}}
				/>
			</DialogContent>
		</Dialog>
	);
}
