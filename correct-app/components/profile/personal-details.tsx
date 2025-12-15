'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserAuth } from '@/contexts/user';
import { showSuccessToast } from '@/lib/utils/toast-handlers';
import { showErrorToast } from '@/lib/utils/toast-handlers';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

type PersonalDetailsForm = {
	name: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	address: string;
	userId?: number;
};

export function PersonalDetails() {
	const { user, updateUser } = useUserAuth();
	const query = useSearchParams();
	const companyId = query.get('company');
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
	} = useForm<PersonalDetailsForm>({
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
			phone: user?.phone || '',
		},
	});

	const onSubmit: SubmitHandler<PersonalDetailsForm> = async (data) => {
		try {
			data['userId'] = user?.id;
			const response = await fetch('/api/profile', {
				method: 'PATCH',
				body: JSON.stringify(data),
			});
			const result = await response.json();
			if (result.success) {
				updateUser(result.data);
				showSuccessToast({
					title: 'Profile Updated',
					message: 'Your personal details have been successfully updated.',
				});
			} else {
				showErrorToast({
					title: 'Error',
					message: 'Failed to update your personal details.',
				});
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			showErrorToast({
				title: 'Error',
				message: 'Failed to update your personal details.',
			});
		}
	};

	return (
		<div>
			<Link
				href={`/profile?company=${companyId}`}
				className='flex items-center text-green mb-4'
			>
				<ChevronRight className='w-5 h-5 rotate-180' />
				<span>Back</span>
			</Link>
			<h2 className='text-mobile-heading md:text-heading3 font-semibold mb-4'>
				Personal Details
			</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-4 pb-14 bg-white '
			>
				<div className='space-y-2'>
					<Label htmlFor='name' className='text-body2 md:text-body1'>
						Full Name
					</Label>
					<Input
						id='name'
						className='text-body1 w-full'
						{...register('name', { required: 'Full Name is required' })}
					/>
					{errors.name && <p className='text-red-500'>{errors.name.message}</p>}
				</div>
				<div className='space-y-2'>
					<Label htmlFor='email' className='text-body2 md:text-body1'>
						Email
					</Label>
					<Input
						id='email'
						className='text-body1 w-full'
						type='email'
						{...register('email', {
							required: 'Email is required',
							pattern: {
								value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
								message: 'Invalid email address',
							},
						})}
					/>
					{errors.email && <p className='text-red-500'>{errors.email.message}</p>}
				</div>
				<div className='space-y-2'>
					<Label htmlFor='phone' className='text-body2 md:text-body1'>
						Phone Number
					</Label>
					<Input
						id='phone'
						className='text-body1 w-full'
						{...register('phone', {
							required: 'Phone Number is required',
							pattern: {
								value: /^\+?[1-9]\d{1,14}$/,
								message: 'Invalid phone number',
							},
						})}
					/>
					{errors.phone && <p className='text-red-500'>{errors.phone.message}</p>}
				</div>

				<Button
					type='submit'
					loading={isSubmitting}
					disabled={isSubmitting}
					className='w-full'
				>
					Save Changes
				</Button>
			</form>
		</div>
	);
}
