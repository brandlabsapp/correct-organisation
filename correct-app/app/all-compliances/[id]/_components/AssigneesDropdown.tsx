import React from 'react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, User } from 'lucide-react';

interface AssigneesDropdownProps {
	availableUsers: AppTypes.Member[];
	addAssignee: (user: AppTypes.Member) => void;
	// getAvailableUsers: () => Assignee[];
}

const AssigneesDropdown = ({
	availableUsers,
	addAssignee,
}: // getAvailableUsers,
AssigneesDropdownProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='sm' className='h-6 w-6 p-0 hover:bg-gray-200'>
					<ChevronDown className='h-4 w-4 text-gray-400' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='start' className='w-48 bg-white text-black'>
				{availableUsers.length > 0 ? (
					availableUsers.map((user) => (
						<DropdownMenuItem
							key={user.user.id}
							onClick={() => addAssignee(user)}
							className='flex items-center gap-2 cursor-pointer'
						>
							<Avatar className='h-6 w-6'>
								<AvatarImage src={'/placeholder.svg'} alt={user.user.name} />
								<AvatarFallback className='text-xs bg-blue-dark'>
									<User className='w-4 h-4' />
								</AvatarFallback>
							</Avatar>
							<span className='text-sm'>{user.user.name}</span>
						</DropdownMenuItem>
					))
				) : (
					<DropdownMenuItem disabled>
						<span className='text-sm text-gray-500'>No more users available</span>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default AssigneesDropdown;
