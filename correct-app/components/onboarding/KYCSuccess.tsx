'use client';
import StatusModal from '@/components/common/Modals/StatusModal';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function KYCSuccess() {
	const [companyId, setCompanyId] = useState<string | null>(null);
	const router = useRouter();
	useEffect(() => {
		const companyId = localStorage.getItem('companyId');
		if (companyId) {
			setCompanyId(companyId);
		}
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
				router.push(`/dashboard?company=${companyId}`);
			}}
		/>
	);
}
