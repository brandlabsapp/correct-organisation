'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SidebarLayout } from '@/components/common/sidebar-layout';

const MessageSkeleton = ({ isUser = false }: { isUser?: boolean }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
            className={`max-w-[80%] p-3 rounded-2xl ${isUser ? 'bg-blue-100' : 'bg-gray-100'
                }`}
        >
            <Skeleton className={`h-4 ${isUser ? 'w-32' : 'w-48'}`} />
            {!isUser && <Skeleton className='h-4 w-36 mt-2' />}
        </div>
    </div>
);

export function ChatSkeleton() {
    return (
        <SidebarLayout>
            <div className='flex flex-col h-full animate-pulse'>
                {/* Chat header */}
                <div className='p-4 border-b flex items-center gap-3'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='space-y-2'>
                        <Skeleton className='h-5 w-32' />
                        <Skeleton className='h-3 w-20' />
                    </div>
                </div>

                {/* Messages area */}
                <div className='flex-1 p-4 overflow-y-auto'>
                    <MessageSkeleton isUser={false} />
                    <MessageSkeleton isUser={true} />
                    <MessageSkeleton isUser={false} />
                    <MessageSkeleton isUser={true} />
                    <MessageSkeleton isUser={false} />
                </div>

                {/* Input area */}
                <div className='p-4 border-t'>
                    <div className='flex gap-2'>
                        <Skeleton className='h-12 flex-1 rounded-full' />
                        <Skeleton className='h-12 w-12 rounded-full' />
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
