'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ManageTeam } from '@/components/profile/manage-team';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ManageTeamPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const companyId = searchParams.get('company');

	useEffect(() => {
		if (!companyId) {
			router.push('/profile');
		}
	}, [companyId, router]);

	if (!companyId) {
		return null;
	}

	return (
		<div className='py-4'>
			<ScrollArea className='max-h-[calc(100vh-14rem)] overflow-y-scroll'>
				<ManageTeam />
			</ScrollArea>
		</div>
	);
}
