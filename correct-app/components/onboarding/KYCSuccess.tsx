'use client';
import StatusModal from '@/components/common/Modals/StatusModal';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function KYCSuccess() {
	const router = useRouter();
	useEffect(() => {
		localStorage.setItem('newUser', 'true');
	}, []);

	return (
		<StatusModal
			title='Congratulations!'
			message='All your details are submitted and we will soon start verify and update you.'
			status='success'
			buttonText='Explore app'
			open={true}
			setOpen={() => {}}
			onButtonClick={() => {
				const companyId = localStorage.getItem('companyId');
				router.push(companyId ? `/dashboard?company=${companyId}` : '/dashboard');
			}}
		/>
	);
}
