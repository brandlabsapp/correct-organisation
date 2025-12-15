import { CheckCircle, User } from 'lucide-react';
import Image from 'next/image';

interface TaskCardProps {
	title: string;
	timeframe: string;
	assigneeImageUrl?: string;
	assigneeName?: string;
}

export const TaskCard = ({
	title,
	timeframe,
	assigneeImageUrl,
	assigneeName,
}: TaskCardProps) => (
	<div className='bg-lightgray p-4 rounded-lg flex items-center justify-between mb-2.5'>
		<div>
			<h3 className='text-body2 md:text-body1 font-bold text-gray-800 text-ellipsis overflow-hidden whitespace-nowrap max-w-[220px] md:max-w-[420px]'>
				{title}
			</h3>
			<p className='text-body3 md:text-body2 text-gray-500 truncate max-w-[150px] md:max-w-[380px] md:text-clip'>
				Due: {timeframe}
			</p>
		</div>
		<div className='flex items-center space-x-2'>
			{assigneeImageUrl ? (
				<Image
					src={assigneeImageUrl}
					alt={assigneeName || title}
					className='h-6 w-6 rounded-full object-cover'
					width={24}
					height={24}
				/>
			) : (
				<div className='h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-semibold'>
					<User className='h-4 w-4' />
				</div>
			)}
			<CheckCircle className='h-6 w-6 text-green-500' />
		</div>
	</div>
);
