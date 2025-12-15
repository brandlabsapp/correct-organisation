import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Bot, UserRound } from 'lucide-react';
import Markdown from './common/Markdown';

interface ChatMessageProps {
	message: {
		content: string;
		role: 'user' | 'assistant' | 'system' | 'data';
		timestamp?: number;
	};
}

export function ChatMessage({ message }: ChatMessageProps) {
	return (
		<div
			className={cn(
				'flex gap-2 md:gap-3 mb-4 md:mb-6 px-1',
				message.role === 'user' ? 'justify-end' : 'justify-start'
			)}
		>
			{message.role === 'assistant' && (
				<div className='shrink-0'>
					<div className='w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-full flex items-center justify-center'>
						<Bot className='h-3 w-3 md:h-4 md:w-4 text-gray-600' />
					</div>
				</div>
			)}

			<div
				className={cn(
					'max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] flex flex-col gap-1',
					message.role === 'user' ? 'items-end' : 'items-start'
				)}
			>
				<div className='flex items-center gap-2 px-1'>
					<span className='text-xs font-medium text-gray-600'>
						{message.role === 'user' ? 'You' : 'Assistant'}
					</span>
					{message.timestamp && (
						<span className='text-xs text-gray-400'>
							{format(message.timestamp, 'HH:mm')}
						</span>
					)}
				</div>

				<div
					className={cn(
						'rounded-2xl px-3 py-2 md:px-4 md:py-3 shadow-sm border',
						message.role === 'user'
							? 'bg-primary text-primary-foreground border-primary/20 rounded-br-md'
							: 'bg-white text-gray-900 border-gray-200 rounded-bl-md'
					)}
				>
					<Markdown content={message.content} />
				</div>
			</div>

			{message.role === 'user' && (
				<div className='shrink-0'>
					<div className='w-6 h-6 md:w-8 md:h-8 bg-primary/10 rounded-full flex items-center justify-center'>
						<UserRound className='h-3 w-3 md:h-4 md:w-4 text-primary' />
					</div>
				</div>
			)}
		</div>
	);
}
