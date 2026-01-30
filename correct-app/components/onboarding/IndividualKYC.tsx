'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';
import { useUserAuth } from '@/contexts/user';

export default function IndividualKYC() {
	const router = useRouter();
	const { company, user, isLoading } = useUserAuth();

	// Check if user already has Aadhaar and PAN, redirect to success page
	useEffect(() => {
		if (!isLoading && user?.aadhar && user?.pan) {
			router.replace('/onboarding/individual-kyc/success');
		}
	}, [user, isLoading, router]);
	const [data, setData] = useState({
		aadhar: '',
		pan: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!data.aadhar || !data.pan) {
			showErrorToast({
				title: 'Missing Information',
				message: 'Please fill in all required fields',
			});
			return;
		}

		try {
			setIsSubmitting(true);
			const response = await fetch('/api/user/update', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					companyId: company?.id,
					aadhar: data.aadhar,
					pan: data.pan,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			if (!result.success) {
				showErrorToast({
					title: 'Error',
					message: result.message || 'Failed to update KYC details',
				});
				setIsSubmitting(false);
				return;
			}

			showSuccessToast({
				title: 'Success',
				message: 'KYC details submitted successfully',
			});
			window.location.href = '/onboarding/individual-kyc/success';
		} catch (error) {
			console.error('Error submitting KYC details:', error);
			showErrorToast({
				title: 'Error',
				message: 'Failed to submit KYC details. Please try again.',
			});
			setIsSubmitting(false);
		}
	};

	// Show loading while checking user data
	if (isLoading || (user?.aadhar && user?.pan)) {
		return (
			<div className='bg-white md:max-w-xl md:mx-auto md:px-4 md:sm:px-6 md:lg:px-8 md:py-4 md:lg:py-6 p-5 space-y-5 flex items-center justify-center min-h-[300px]'>
				<p className='text-body1 text-gray-500'>Loading...</p>
			</div>
		);
	}

	return (
		<div className='bg-white md:max-w-xl md:mx-auto md:px-4 md:sm:px-6 md:lg:px-8 md:py-4 md:lg:py-6 p-5 space-y-5'>
			<div className='flex flex-col w-full gap-5'>
				<h3 className='text-heading3 md:text-heading3 font-bold text-black'>
					Individual KYC
				</h3>
			</div>

			<div className='flex flex-col w-full gap-5'>
				<p className='text-body1 text-black'>Aadhaar card number</p>
				<Input
					type='text'
					className='w-full'
					placeholder='XXXXXX'
					value={data.aadhar}
					onChange={(e) => setData({ ...data, aadhar: e.target.value })}
				/>
			</div>

			<div className='flex flex-col w-full gap-5'>
				<p className='text-body1 text-black'>Pan card number</p>
				<Input
					type='text'
					className='w-full'
					placeholder='XXXXXX'
					value={data.pan}
					onChange={(e) => setData({ ...data, pan: e.target.value })}
				/>
			</div>

			<div className='flex flex-col w-full gap-5 mt-5'>
				<Button className='w-full' onClick={handleSubmit} disabled={isSubmitting}>
					{isSubmitting ? 'Submitting...' : 'Submit Details'}
				</Button>
			</div>
		</div>
	);
}
