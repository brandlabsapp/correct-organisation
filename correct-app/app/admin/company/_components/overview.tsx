'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
	Building2,
	MapPin,
	Users,
	Briefcase,
	Calendar,
	DollarSign,
} from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import { Separator } from '@/components/ui/separator';

interface CompanyData {
	id: number;
	uuid: string;
	cin: string;
	pan: string;
	gst: string;
	name: string;
	address: string;
	city: string;
	state: string;
	country: string;
	industry: string;
	revenue: string;
	din: string;
	teamSize: number;
	userId: number;
	createdAt: string;
	updatedAt: string;
}

export function Overview({ companyData }: { companyData: CompanyData }) {
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<CompanyData>({
		defaultValues: companyData,
	});

	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = form;

	const onSubmit: SubmitHandler<CompanyData> = async (data) => {
		const payload = {
			name: data.name,
			address: data.address,
			city: data.city,
			state: data.state,
			country: data.country,
			industry: data.industry,
			revenue: data.revenue,
			din: data.din,
			teamSize: data.teamSize,
		};
		const response = await fetch(`/api/profile/company/${companyData?.id}`, {
			method: 'PATCH',
			body: JSON.stringify(payload),
		});
		const result = await response.json();
		if (!result.success) {
			showErrorToast({
				error: result,
			});
		} else {
			showSuccessToast({
				title: 'Company Details Updated',
				message: 'Your company information has been successfully updated.',
			});
		}
		window.location.reload();
		setIsEditing(false);
	};

	return (
		<div className='p-6 space-y-6'>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
				<Card className='bg-white shadow-sm border-gray-100'>
					<CardHeader className='p-6 border-b'>
						<div className='flex justify-between items-center'>
							<CardTitle className='text-2xl font-bold text-gray-900'>
								Company Overview
							</CardTitle>
							<div>
								{isEditing ? (
									<div className='flex gap-2'>
										<Button
											type='submit'
											className='bg-green hover:bg-green-dark text-white'
											disabled={isSubmitting}
										>
											{isSubmitting ? 'Saving...' : 'Save Changes'}
										</Button>
										<Button
											variant='outline'
											onClick={() => setIsEditing(false)}
											className='border-gray-200 hover:bg-gray-50'
										>
											Cancel
										</Button>
									</div>
								) : (
									<Button
										type='button'
										onClick={() => setIsEditing(true)}
										className='bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
									>
										Edit Details
									</Button>
								)}
							</div>
						</div>
					</CardHeader>

					<CardContent className='p-6'>
						<div className='space-y-8'>
							{/* Company Basic Info */}
							<div className='flex items-start space-x-4'>
								<div className='p-3 bg-blue rounded-lg'>
									<Building2 className='h-6 w-6 text-blue-dark' />
								</div>
								<div className='flex-1 space-y-1'>
									<Label htmlFor='name' className='text-sm font-medium text-gray-500'>
										Company Name
									</Label>
									{isEditing ? (
										<Input
											id='name'
											{...register('name')}
											className='mt-1 border-gray-200 focus:ring-green focus:border-green'
										/>
									) : (
										<>
											<h3 className='text-xl font-semibold text-gray-900'>
												{companyData.name ?? 'N/A'}
											</h3>
											<p className='text-sm text-gray-500'>
												{companyData.industry
													? `${companyData.industry} Company`
													: 'Industry not specified'}
											</p>
										</>
									)}
								</div>
							</div>

							<Separator className='my-6' />

							{/* Registration Details */}
							<div className='space-y-6'>
								<h4 className='text-lg font-semibold text-gray-900'>
									Registration Details
								</h4>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
									<div className='space-y-2'>
										<Label htmlFor='cin' className='text-sm font-medium text-gray-500'>
											CIN
										</Label>
										{isEditing ? (
											<Input
												id='cin'
												{...register('cin')}
												className='border-gray-200 focus:ring-green focus:border-green'
											/>
										) : (
											<p className='text-sm text-gray-900 font-medium'>
												{companyData.cin ?? 'N/A'}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='pan' className='text-sm font-medium text-gray-500'>
											PAN
										</Label>
										{isEditing ? (
											<Input
												id='pan'
												{...register('pan')}
												className='border-gray-200 focus:ring-green focus:border-green'
											/>
										) : (
											<p className='text-sm text-gray-900 font-medium'>
												{companyData.pan ?? 'N/A'}
											</p>
										)}
									</div>
									<div className='space-y-2'>
										<Label htmlFor='gst' className='text-sm font-medium text-gray-500'>
											GST
										</Label>
										{isEditing ? (
											<Input
												id='gst'
												{...register('gst')}
												className='border-gray-200 focus:ring-green focus:border-green'
											/>
										) : (
											<p className='text-sm text-gray-900 font-medium'>
												{companyData.gst ?? 'N/A'}
											</p>
										)}
									</div>
								</div>
							</div>

							<Separator className='my-6' />

							{/* Address Section */}
							<div className='space-y-6'>
								<div className='flex items-center space-x-2'>
									<MapPin className='h-5 w-5 text-gray-400' />
									<h4 className='text-lg font-semibold text-gray-900'>Location</h4>
								</div>
								<div className='space-y-4'>
									<div>
										<Label
											htmlFor='address'
											className='text-sm font-medium text-gray-500'
										>
											Street Address
										</Label>
										{isEditing ? (
											<Input
												id='address'
												{...register('address')}
												className='mt-1 border-gray-200 focus:ring-green focus:border-green'
											/>
										) : (
											<p className='text-sm text-gray-900'>
												{companyData.address ?? 'N/A'}
											</p>
										)}
									</div>
									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										<div>
											<Label htmlFor='city' className='text-sm font-medium text-gray-500'>
												City
											</Label>
											{isEditing ? (
												<Input
													id='city'
													{...register('city')}
													className='mt-1 border-gray-200 focus:ring-green focus:border-green'
												/>
											) : (
												<p className='text-sm text-gray-900'>{companyData.city ?? 'N/A'}</p>
											)}
										</div>
										<div>
											<Label htmlFor='state' className='text-sm font-medium text-gray-500'>
												State
											</Label>
											{isEditing ? (
												<Input
													id='state'
													{...register('state')}
													className='mt-1 border-gray-200 focus:ring-green focus:border-green'
												/>
											) : (
												<p className='text-sm text-gray-900'>
													{companyData.state ?? 'N/A'}
												</p>
											)}
										</div>
										<div>
											<Label
												htmlFor='country'
												className='text-sm font-medium text-gray-500'
											>
												Country
											</Label>
											{isEditing ? (
												<Input
													value={companyData.country ? companyData.country : 'India'}
													id='country'
													{...register('country')}
													className='mt-1 border-gray-200 focus:ring-green focus:border-green'
												/>
											) : (
												<p className='text-sm text-gray-900'>
													{companyData.country ?? 'N/A'}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							<Separator className='my-6' />

							{/* Company Details */}
							<div className='space-y-6'>
								<h4 className='text-lg font-semibold text-gray-900'>Company Details</h4>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
									<div className='flex items-start space-x-3'>
										<Briefcase className='h-5 w-5 text-gray-400 mt-1' />
										<div className='space-y-1'>
											<Label
												htmlFor='industry'
												className='text-sm font-medium text-gray-500'
											>
												Industry
											</Label>
											{isEditing ? (
												<Input
													id='industry'
													{...register('industry')}
													className='mt-1 border-gray-200 focus:ring-green focus:border-green'
												/>
											) : (
												<p className='text-sm text-gray-900'>
													{companyData.industry ?? 'N/A'}
												</p>
											)}
										</div>
									</div>
									<div className='flex items-start space-x-3'>
										<Users className='h-5 w-5 text-gray-400 mt-1' />
										<div className='space-y-1'>
											<Label
												htmlFor='teamSize'
												className='text-sm font-medium text-gray-500'
											>
												Team Size
											</Label>
											{isEditing ? (
												<Input
													id='teamSize'
													type='number'
													{...register('teamSize', { valueAsNumber: true })}
													className='mt-1 border-gray-200 focus:ring-green focus:border-green'
												/>
											) : (
												<p className='text-sm text-gray-900'>
													{companyData.teamSize ?? 'N/A'}
												</p>
											)}
										</div>
									</div>
									<div className='flex items-start space-x-3'>
										<DollarSign className='h-5 w-5 text-gray-400 mt-1' />
										<div className='space-y-1'>
											<Label
												htmlFor='revenue'
												className='text-sm font-medium text-gray-500'
											>
												Revenue
											</Label>
											{isEditing ? (
												<Input
													id='revenue'
													{...register('revenue')}
													className='mt-1 border-gray-200 focus:ring-green focus:border-green'
												/>
											) : (
												<p className='text-sm text-gray-900'>
													{companyData.revenue ?? 'N/A'}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							<Separator className='my-6' />

							{/* Created At */}
							<div className='flex items-start space-x-3'>
								<Calendar className='h-5 w-5 text-gray-400 mt-1' />
								<div className='space-y-1'>
									<Label className='text-sm font-medium text-gray-500'>Created At</Label>
									<p className='text-sm text-gray-900'>
										{companyData.createdAt
											? new Date(companyData.createdAt).toLocaleDateString('en-US', {
													day: 'numeric',
													month: 'long',
													year: 'numeric',
											  })
											: 'N/A'}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
}
