import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, User } from 'lucide-react';
import React from 'react';

interface TagCardProps {
	assignee: AppTypes.Member;
	removeAssignee: (id: number) => void;
}

const TagCard = ({ assignee, removeAssignee }: TagCardProps) => {
	return (
		<Badge
			key={assignee.id}
			className='flex items-center gap-2 px-2 py-1 bg-blue-light border cursor-pointer'
		>
			<Avatar className='h-6 w-6'>
				<AvatarImage src={'/placeholder.svg'} alt={assignee.user.name} />
				<AvatarFallback className='text-xs text-black bg-blue-dark'>
					{assignee.user.name ? (
						assignee.user.name
							.split(' ')
							.map((n) => n[0])
							.join('')
					) : (
						<User className='w-4 h-4' />
					)}
				</AvatarFallback>
			</Avatar>
			<span className='text-sm text-black'>{assignee.user.name}</span>
			<Button
				variant='ghost'
				size='sm'
				className='h-4 w-4 p-0 hover:bg-gray-200'
				onClick={() => removeAssignee(assignee.id)}
			>
				<X className='h-3 w-3' />
			</Button>
		</Badge>
	);
};

export default TagCard;
