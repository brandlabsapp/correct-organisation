'use client';

import { useState, useCallback } from 'react';
import { SubmitHandler, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserAuth } from '@/contexts/user';
import { Select } from '@radix-ui/react-select';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { industries } from '@/data/static/onboarding';
import { showErrorToast } from '@/lib/utils/toast-handlers';
import { showSuccessToast } from '@/lib/utils/toast-handlers';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useFormWithAsyncDefaults } from '@/hooks/useFormWithAsyncDefaults';

type FormValues = {
	name: string;
	address: string;
	city: string;
	state: string;
	zip: string;
	industry: string;
	teamSize: number;
	revenue?: string;
	din: string;
	referralCode?: string;
};


// Fetch city and state from Indian pincode using India Post API
async function fetchLocationFromPincode(
	pincode: string
): Promise<{ city: string; state: string } | null> {
	try {
		const response = await fetch(
			`https://api.postalpincode.in/pincode/${pincode}`
		);
		const data = await response.json();

		if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
			const postOffice = data[0].PostOffice[0];
			return {
				city: postOffice.District || postOffice.Name || '',
				state: postOffice.State || '',
			};
		}
		return null;
	} catch (error) {
		console.error('Error fetching pincode data:', error);
		return null;
	}
}

export function CompanyDetails() {
	const { company } = useUserAuth();
	const query = useSearchParams();
	const companyId = query.get('company');
	const [isFetchingPincode, setIsFetchingPincode] = useState(false);

	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors, isSubmitting },
	} = useFormWithAsyncDefaults<FormValues, AppTypes.Company>(
		company,
		(data) => ({
			name: data.name || '',
			address: data.address || '',
			city: data.city || '',
			state: data.state || '',
			zip: data.zip || '',
			industry: data.industry || '',
			teamSize: data.teamSize || 1,
			revenue: data.revenue || '',
			din: data.din || '',
			referralCode: data.referralCode || '',
		})
	);

	const handlePincodeChange = useCallback(
		async (pincode: string,) => {
			if (!/^\d{6}$/.test(pincode)) return;

			setIsFetchingPincode(true);
			try {
				const location = await fetchLocationFromPincode(pincode);
				if (location) {
					setValue('city', location.city, { shouldValidate: true });
					setValue('state', location.state, { shouldValidate: true });
				}
			} finally {
				setIsFetchingPincode(false);
			}
		},
		[setValue]
	);


	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		const response = await fetch(`/api/profile/company/${company?.uuid}`, {
			method: 'PATCH',
			body: JSON.stringify(data),
		});
		const result = await response.json();
		if (!result.success) {
			showErrorToast({
				title: 'Error',
				message: result.message,
				action: {
					label: 'Retry',
					onClick: () => {
						handleSubmit(onSubmit)();
					},
				},
			});
		} else {
			showSuccessToast({
				title: 'Success',
				message: 'Your company information has been successfully updated.',
			});
		}
	};

	return (
		<div className='h-full overflow-y-scroll'>
			<Link
				href={`/profile?company=${companyId}`}
				className='flex items-center text-green mb-4'
			>
				<ChevronRight className='w-5 h-5 rotate-180' />
				<span>Back</span>
			</Link>
			<h2 className='text-mobile-heading md:text-heading3 font-semibold mb-4'>
				Company Details
			</h2>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='name'>Company Name </Label>
					<Controller
						name='name'
						control={control}
						rules={{ required: 'Company name is required' }}
						render={({ field }) => (
							<Input
								{...field}
								id='name'
								className='text-sm md:text-base w-full'
								placeholder='Enter Company Name'
							/>
						)}
					/>
					{errors.name && (
						<p className='text-red-500 text-sm'>{errors.name.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='address'>Address </Label>
					<Controller
						name='address'
						control={control}
						rules={{ required: 'Address is required' }}
						render={({ field }) => (
							<Input
								{...field}
								id='address'
								className='text-sm md:text-base w-full'
								placeholder='Enter Address'
							/>
						)}
					/>
					{errors.address && (
						<p className='text-red-500 text-sm'>{errors.address.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='zip'>Pincode </Label>
					<Controller
						name='zip'
						control={control}
						rules={{
							required: 'Pincode is required',
							pattern: {
								value: /^\d{6}$/,
								message: 'Please enter a valid 6-digit Indian pincode',
							},
						}}
						render={({ field }) => (
							<div className='relative'>
								<Input
									{...field}
									id='zip'
									type='text'
									inputMode='numeric'
									maxLength={6}
									className='text-sm md:text-base w-full'
									placeholder='Enter 6-digit pincode'
									onChange={(e) => {
										const value = e.target.value.replace(/\D/g, '');
										field.onChange(value);
										handlePincodeChange(value);
									}}
								/>
								{isFetchingPincode && (
									<div className='absolute right-3 top-1/2 -translate-y-1/2'>
										<Loader2 className='h-4 w-4 animate-spin text-gray-400' />
									</div>
								)}
							</div>
						)}
					/>
					{errors.zip && (
						<p className='text-red-500 text-sm'>{errors.zip.message}</p>
					)}
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<Label htmlFor='city'>City </Label>
						<Controller
							name='city'
							control={control}
							rules={{ required: 'City is required' }}
							render={({ field }) => (
								<Input
									{...field}
									id='city'
									className='text-sm md:text-base w-full bg-gray-50'
									placeholder='Auto-filled from pincode'
									readOnly={isFetchingPincode}
								/>
							)}
						/>
						{errors.city && (
							<p className='text-red-500 text-sm'>{errors.city.message}</p>
						)}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='state'>State </Label>
						<Controller
							name='state'
							control={control}
							rules={{ required: 'State is required' }}
							render={({ field }) => (
								<Input
									{...field}
									id='state'
									className='text-sm md:text-base w-full bg-gray-50'
									placeholder='Auto-filled from pincode'
									readOnly={isFetchingPincode}
								/>
							)}
						/>
						{errors.state && (
							<p className='text-red-500 text-sm'>{errors.state.message}</p>
						)}
					</div>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='industry'>Industry</Label>
					<Controller
						name='industry'
						control={control}
						rules={{ required: 'Please select an industry' }}
						render={({ field }) => (
							<Select
								value={field.value}
								onValueChange={(value) => field.onChange(value)}
							>
								<SelectTrigger>
									<SelectValue placeholder='Select industry' />
								</SelectTrigger>
								<SelectContent>
									{industries.map((industry) => (
										<SelectItem
											key={industry.value}
											className='text-sm md:text-base w-full'
											value={industry.value}
										>
											{industry.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					{errors.industry && (
						<p className='text-red-500 text-sm'>{errors.industry.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='teamSize'>Team Size </Label>
					<Controller
						name='teamSize'
						control={control}
						rules={{
							min: { value: 1, message: 'Team size must be at least 1' },
							required: 'Team size is required',
						}}
						render={({ field }) => (
							<Input
								{...field}
								type='number'
								id='teamSize'
								placeholder='Enter team size'
								min={1}
								className='text-sm md:text-base w-full'
							/>
						)}
					/>
					{errors.teamSize && (
						<p className='text-red-500 text-sm'>{errors.teamSize.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='revenue'>Annual Revenue (Optional)</Label>
					<Controller
						name='revenue'
						control={control}
						rules={{
							validate: (value) => {
								if (!value) return true; // Optional field
								const numValue = Number(value.replace(/[^0-9]/g, ''));
								if (isNaN(numValue)) return 'Please enter a valid number';
								if (numValue > MAX_REVENUE)
									return 'Revenue cannot exceed ₹100 crore';
								return true;
							},
						}}
						render={({ field }) => (
							<Input
								{...field}
								id='revenue'
								className='text-sm md:text-base w-full'
								placeholder='Enter annual revenue in INR (max ₹100 crore)'
							/>
						)}
					/>
					{errors.revenue && (
						<p className='text-red-500 text-sm'>{errors.revenue.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<Label htmlFor='referralCode'>Referral Code (Optional)</Label>
					<Controller
						name='referralCode'
						control={control}
						render={({ field }) => (
							<Input
								{...field}
								id='referralCode'
								className='text-sm md:text-base w-full'
								placeholder='Enter referral code'
							/>
						)}
					/>
				</div>

				<Button
					type='submit'
					disabled={isSubmitting}
					loading={isSubmitting}
					className='w-full'
				>
					{isSubmitting ? 'Saving...' : 'Save Changes'}
				</Button>
			</form>
		</div>
	);
}

