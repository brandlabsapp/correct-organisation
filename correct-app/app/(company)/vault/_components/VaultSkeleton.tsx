'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SidebarLayout } from '@/components/common/sidebar-layout';

const FolderSkeleton = () => (
    <div className='bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3'>
        <Skeleton className='h-10 w-10 rounded-lg' />
        <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-1/2' />
            <Skeleton className='h-3 w-1/4' />
        </div>
    </div>
);

const DocumentSkeleton = () => (
    <div className='bg-white p-4 rounded-xl border border-gray-100 space-y-3'>
        <div className='flex items-center gap-3'>
            <Skeleton className='h-12 w-12 rounded-lg' />
            <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-3 w-1/2' />
            </div>
        </div>
        <div className='flex gap-2'>
            <Skeleton className='h-6 w-16 rounded-full' />
            <Skeleton className='h-6 w-20 rounded-full' />
        </div>
    </div>
);

export function VaultSkeleton() {
    return (
        <SidebarLayout>
            <div className='h-full overflow-y-scroll animate-pulse p-4'>
                {/* Header */}
                <div className='flex justify-between items-center mb-6'>
                    <Skeleton className='h-8 w-24' />
                    <div className='flex gap-2'>
                        <Skeleton className='h-10 w-10 rounded-lg' />
                        <Skeleton className='h-10 w-32 rounded-lg' />
                    </div>
                </div>

                {/* Search bar */}
                <Skeleton className='h-10 w-full max-w-md mb-6 rounded-lg' />

                {/* Folders section */}
                <div className='mb-6'>
                    <Skeleton className='h-5 w-20 mb-3' />
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <FolderSkeleton key={i} />
                        ))}
                    </div>
                </div>

                {/* Documents section */}
                <div>
                    <Skeleton className='h-5 w-24 mb-3' />
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <DocumentSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
