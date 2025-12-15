import { Button } from '@/components/ui/button';

interface QuickActionButtonsProps {
	onActionClick: (action: string) => void;
}

export function QuickActionButtons({ onActionClick }: QuickActionButtonsProps) {
	const actions = [
		'What are the key compliance requirements for my industry?',
		'How do I prepare for a compliance audit?',
		'What are the recent regulatory changes I should be aware of?',
		'Can you explain the process of risk assessment in compliance?',
	];

	return (
		<div className='flex flex-wrap gap-2 p-2 border-t'>
			{actions.map((action, index) => (
				<Button
					key={index}
					variant='outline'
					className={`text-[10px] md:text-sm text-start whitespace-normal h-auto min-h-[2.5rem] flex-1 max-w-[calc(50%-0.5rem)] ${
						index > 1 ? 'hidden md:flex' : ''
					}`}
					onClick={() => onActionClick(action)}
				>
					{action}
				</Button>
			))}
		</div>
	);
}
