import { cn } from '@/lib/utils';
import { BottomNav } from './bottom-nav';
import Image from 'next/image';
import { Button } from '../ui/button';

export const FetchFallback = ({
	title,
	titleClassName,
	description,
	subDescription,
	descriptionClassName,
}: {
	title: string;
	titleClassName?: string;
	description?: string;
	subDescription?: string;
	descriptionClassName?: string;
}) => {
	return (
		<div className='flex flex-col min-h-screen bg-white justify-center items-center'>
			<div className='flex flex-col justify-center items-center w-[270px] sm:w-[350px]'>
				<Image
					src='/assets/icons/check.svg'
					alt='check'
					width={100}
					height={100}
					className='min-h-20 min-w-20'
				/>
				<p className={cn('font-semibold md:text-xl text-black', titleClassName)}>
					{title}
				</p>
				<div className='space-y-2 mt-2'>
					{description && (
						<p
							className={cn(
								'text-body1 text-center md:text-sm text-secondarygray-dark',
								descriptionClassName
							)}
						>
							{description}
						</p>
					)}
					{subDescription && (
						<p
							className={cn(
								'text-body1 text-center md:text-sm text-secondarygray-dark',
								descriptionClassName
							)}
						>
							{subDescription}
						</p>
					)}
				</div>
				<Button className='w-full mt-6'>Explore Resources</Button>
			</div>
			<BottomNav />
		</div>
	);
};
