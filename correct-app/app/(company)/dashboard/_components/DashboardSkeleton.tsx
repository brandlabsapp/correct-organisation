'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SidebarLayout } from '@/components/common/sidebar-layout';

const CardSkeleton = () => (
	<div className='bg-white p-4 rounded-xl border border-gray-100 space-y-3'>
		<div className='flex items-center justify-between'>
			<Skeleton className='h-5 w-3/4' />
			<Skeleton className='h-4 w-4 rounded-full' />
		</div>
		<div className='flex items-center gap-2'>
			<Skeleton className='h-5 w-16 rounded-full' />
			<Skeleton className='h-4 w-24' />
		</div>
	</div>
);

const TaskSkeleton = () => (
	<div className='bg-white p-3 rounded-lg border border-gray-100 flex items-center gap-3'>
		<Skeleton className='h-5 w-5 rounded' />
		<div className='flex-1 space-y-2'>
			<Skeleton className='h-4 w-2/3' />
			<Skeleton className='h-3 w-1/3' />
		</div>
	</div>
);

const SectionSkeleton = ({
	title,
	cardCount = 3,
	isTask = false,
}: {
	title: string;
	cardCount?: number;
	isTask?: boolean;
}) => (
	<div className='space-y-4'>
		<div className='flex items-center justify-between'>
			<Skeleton className='h-5 w-40' />
			<Skeleton className='h-4 w-16' />
		</div>
		<div className='space-y-3'>
			{Array.from({ length: cardCount }).map((_, i) =>
				isTask ? <TaskSkeleton key={i} /> : <CardSkeleton key={i} />
			)}
		</div>
	</div>
);

export function DashboardSkeleton() {
	return (
		<SidebarLayout>
			<div className='h-full overflow-y-scroll animate-pulse'>
				<div className='flex justify-between items-center mb-5 p-3'>
					<Skeleton className='h-8 w-20' />
				</div>
				<main className='px-4 space-y-8'>
					<SectionSkeleton title='Upcoming Compliances' cardCount={3} />
					<SectionSkeleton title='Essential tasks' cardCount={4} isTask />
				</main>
			</div>
		</SidebarLayout>
	);
}
