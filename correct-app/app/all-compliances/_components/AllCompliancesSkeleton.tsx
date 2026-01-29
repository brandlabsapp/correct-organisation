'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SidebarLayout } from '@/components/common/sidebar-layout';

const ComplianceCardSkeleton = () => (
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

export function AllCompliancesSkeleton() {
    return (
        <SidebarLayout>
            <div className='animate-pulse'>
                {/* Header */}
                <header className='p-4 pt-12 pb-6'>
                    <Skeleton className='h-8 w-40' />
                </header>

                {/* Tabs */}
                <main className='px-4'>
                    <div className='grid w-full grid-cols-2 mb-4 gap-2'>
                        <Skeleton className='h-10 rounded-lg' />
                        <Skeleton className='h-10 rounded-lg' />
                    </div>

                    {/* Compliance cards */}
                    <div className='space-y-3'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <ComplianceCardSkeleton key={i} />
                        ))}
                    </div>
                </main>
            </div>
        </SidebarLayout>
    );
}
