'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SidebarLayout } from '@/components/common/sidebar-layout';

const TaskItemSkeleton = () => (
    <div className='bg-white p-3 rounded-lg border border-gray-100 flex items-center gap-3'>
        <Skeleton className='h-5 w-5 rounded' />
        <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-2/3' />
            <Skeleton className='h-3 w-1/3' />
        </div>
        <Skeleton className='h-8 w-8 rounded-full' />
    </div>
);

const SectionSkeleton = ({ title }: { title: string }) => (
    <div className='space-y-4 px-4'>
        <Skeleton className='h-5 w-28' />
        <div className='space-y-3'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6' />
            <Skeleton className='h-4 w-4/5' />
        </div>
    </div>
);

export function ComplianceDetailSkeleton() {
    return (
        <SidebarLayout>
            <div className='space-y-4 animate-pulse'>
                {/* Header */}
                <div className='p-4 space-y-4'>
                    <div className='flex items-center gap-2'>
                        <Skeleton className='h-6 w-6 rounded' />
                        <Skeleton className='h-6 w-32' />
                    </div>
                    <Skeleton className='h-8 w-3/4' />
                    <div className='flex gap-2'>
                        <Skeleton className='h-6 w-20 rounded-full' />
                        <Skeleton className='h-6 w-28' />
                        <Skeleton className='h-6 w-24' />
                    </div>
                    {/* Progress bar */}
                    <Skeleton className='h-2 w-full rounded-full' />
                </div>

                {/* Tasks section */}
                <div className='px-4 space-y-3'>
                    <Skeleton className='h-5 w-16' />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <TaskItemSkeleton key={i} />
                    ))}
                </div>

                {/* Separator */}
                <Skeleton className='h-px w-full' />

                {/* Overview section */}
                <SectionSkeleton title='Overview' />

                {/* Separator */}
                <Skeleton className='h-px w-full' />

                {/* Documents section */}
                <div className='px-4 space-y-3'>
                    <Skeleton className='h-5 w-24' />
                    <div className='grid grid-cols-2 gap-3'>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className='p-3 border rounded-lg space-y-2'>
                                <Skeleton className='h-8 w-8 rounded' />
                                <Skeleton className='h-4 w-full' />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
