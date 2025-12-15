import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ChecklistCardProps {
	title: string;
	type: string;
	timeframe: string;
	handleClick?: () => void;
	href?: string;
}

export const ChecklistCard = ({
	title,
	type,
	timeframe,
	handleClick,
	href,
}: ChecklistCardProps) => {
	const content = (
		<div className='flex items-center justify-between w-full gap-3 md:gap-4'>
			<div className='flex flex-col items-start gap-2 min-w-0 flex-shrink'>
				<h3 className='text-sm md:text-base font-bold text-gray-800 truncate w-full max-w-[120px] sm:max-w-[200px] md:max-w-none'>
					{title}
				</h3>
				<span className='text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full whitespace-nowrap'>
					{type}
				</span>
			</div>
			<p className='text-xs md:text-sm text-gray-500 text-center flex-1 min-w-0 px-2 hidden sm:block md:truncate'>
				{timeframe}
			</p>
			<div className='flex items-center gap-2 md:gap-3 flex-shrink-0'>
				<div className='h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-blue-500 border-t-gray-300'></div>
				<ChevronRight className='h-4 w-4 md:h-5 md:w-5 text-gray-400' />
			</div>
		</div>
	);

	const className =
		'bg-lightgray p-4 rounded-lg flex items-center justify-between mb-2.5';

	if (href) {
		return (
			<Link href={href} className={className}>
				{content}
			</Link>
		);
	}
	return (
		<div
			onClick={handleClick}
			className={className}
			role='button'
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') handleClick?.();
			}}
		>
			{content}
		</div>
	);
};
