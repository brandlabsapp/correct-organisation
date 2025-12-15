'use client';

import { Button } from '@/components/ui/button';
import { clearCookies } from '@/utils/common/common';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
	const router = useRouter();
	const handleLogout = async () => {
		try {
			await clearCookies('Authentication');
			await showSuccessToast({
				title: 'Logged Out',
				message: 'You have been successfully logged out.',
			});
			router.push('/login');
		} catch (e) {
			console.error(e);
			showErrorToast({ error: e });
		}
	};

	return (
		<ScrollArea className='h-[calc(100vh-14rem)]'>
			<div className='space-y-4'>
				<Button
					onClick={handleLogout}
					variant='destructive'
					className='w-full text-sm md:w-auto md:text-base'
				>
					Logout
				</Button>
			</div>
		</ScrollArea>
	);
}
