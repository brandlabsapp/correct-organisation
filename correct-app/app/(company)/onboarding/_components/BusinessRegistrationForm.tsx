'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUserAuth } from '@/contexts/user';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import { CircleCheck } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CIN_REGEX } from '@/utils/constants/regex';
import { FileInput } from '@/components/common/FileInput';
import { analyseFile } from '@/lib/n8n/services';
import { TextCard } from '@/components/common/TextCard';

const businessSchema = z
	.object({
		cin: z.preprocess(
			(val) => (val === '' ? undefined : val),
			z
				.string()
				.min(21, 'CIN must be at least 21 characters')
				.max(21, 'CIN must be exactly 21 characters')
				.regex(CIN_REGEX, 'Please enter a valid CIN format')
				.optional()
		),
		documentFile: z.instanceof(File).optional(),
	})
	.superRefine(({ cin, documentFile }, ctx) => {
		if (!cin && !documentFile) {
			ctx.addIssue({
				code: 'custom',
				path: ['cin'],
				message: 'Either CIN or incorporation document is required',
			});
			ctx.addIssue({
				code: 'custom',
				path: ['documentFile'],
				message: 'Either CIN or incorporation document is required',
			});
		}
	});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessRegistrationPage() {
	const [verificationStatus, setVerificationStatus] = useState<
		'idle' | 'verifying' | 'success' | 'error'
	>('idle');
	const [registrationMethod, setRegistrationMethod] = useState<
		'cin' | 'document'
	>('cin');
	const [documentFile, setDocumentFile] = useState<File | null>(null);
	const [documentAnalysis, setDocumentAnalysis] = useState<any>(null);

	const router = useRouter();
	const { updateCompany, user } = useUserAuth();

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting, isValid },
	} = useForm<BusinessFormData>({
		resolver: zodResolver(businessSchema),
		mode: 'onChange',
		defaultValues: {
			cin: '',
		},
	});

	const handleFileChange = (file: File) => {
		setDocumentFile(file);
		setValue('documentFile', file, { shouldValidate: true });
		setValue('cin', '', { shouldValidate: true });
		setRegistrationMethod('document');
	};

	const onSubmit = useCallback(
		async (data: BusinessFormData) => {
			setVerificationStatus('verifying');

			try {
				if (registrationMethod === 'cin' && data.cin) {
					const verifyResponse = await fetch('/api/verify/cin', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ cin: data.cin }),
					});

					if (!verifyResponse.ok) {
						setVerificationStatus('error');
						await showErrorToast({ error: verifyResponse });
						throw new Error('CIN verification failed');
					}

					setVerificationStatus('success');

					const registerResponse = await fetch('/api/onboarding/register-business', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ cin: data.cin, userId: user?.id }),
					});

					const result = await registerResponse.json();

					if (result.success) {
						console.log(result.data);
						updateCompany(result.data);
						showSuccessToast({
							title: 'Success',
							message: 'Business registered successfully, proceed to business profile',
						});
						localStorage.setItem('companyId', result.data?.id);
						router.push('/verify?role=owner');
					} else {
						throw new Error(result.message || 'Failed to register business');
					}
				} else if (registrationMethod === 'document' && documentFile) {
					const formData = new FormData();
					formData.append('data', documentFile);
					if (user?.id) {
						formData.append('userId', user.id.toString());
					}

					const uploadResponse = await analyseFile(formData);

					if (!uploadResponse.ok) {
						setVerificationStatus('error');
						await showErrorToast({ error: uploadResponse });
						throw new Error('Document upload failed');
					}
					const result = await uploadResponse.json();
					console.log(result);
					setDocumentAnalysis(result);

					const registerCompanyResponse = await fetch(
						'/api/onboarding/register-business',
						{
							method: 'POST',
							body: JSON.stringify({
								name: result.data?.company_name,
								pan: result.data?.pan,
								address: result.data?.registered_address,
								cin: result.data?.cin,
								zip: result.data?.zip,
								type: result.data?.type,
								incorporationDate: result.data?.date_of_incorporation,
								country: result.data?.country,
								state: result.data?.state,
								city: result.data?.city,
								userId: user?.id,
							}),
						}
					);

					const registerCompanyResult = await registerCompanyResponse.json();
					console.log(registerCompanyResult);

					if (registerCompanyResult.success) {
						updateCompany(registerCompanyResult.data);
						showSuccessToast({
							title: 'Success',
							message: 'Business registered successfully, proceed to business profile',
						});
						localStorage.setItem('companyId', registerCompanyResult.data?.id);
						router.push('/verify?role=owner');
					} else {
						throw new Error(
							registerCompanyResult.message || 'Failed to register business'
						);
					}
				}
			} catch (error) {
				setVerificationStatus('error');
				await showErrorToast({ error });
			} finally {
				setVerificationStatus('idle');
			}
		},
		[router, updateCompany, user?.id, registrationMethod, documentFile]
	);

	return (
		<div className='flex md:h-[calc(100vh-3.7rem)] w-full md:max-w-4xl md:mx-auto px-5 py-6'>
			<div className='flex flex-col w-full gap-5 justify-center'>
				<h3 className='text-heading3 font-bold text-black md:text-heading2'>
					Add your business
				</h3>
				<p className='text-body2 text-black md:text-body1'>
					Register your business using CIN or upload incorporation documents
				</p>

				<div className='flex flex-col space-y-2 md:space-y-4'>
					<div className='flex space-x-4'>
						<button
							type='button'
							className={`px-4 py-2 rounded-md text-body2 md:text-body1 ${
								registrationMethod === 'cin'
									? 'bg-green text-black'
									: 'bg-lightgray text-gray-700'
							}`}
							onClick={() => {
								setRegistrationMethod('cin');
							}}
						>
							Register with CIN
						</button>
						{/* <button
							type='button'
							className={`px-4 py-2 rounded-md text-body2 md:text-body1 ${
								registrationMethod === 'document'
									? 'bg-green text-black'
									: 'bg-lightgray text-gray-700'
							}`}
							onClick={() => {
								setRegistrationMethod('document');
							}}
						>
							Upload Documents
						</button> */}
					</div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					{registrationMethod === 'cin' ? (
						<>
							<Input
								id='cin'
								{...register('cin')}
								placeholder='CIN'
								className='w-full'
								state={
									verificationStatus === 'success'
										? 'success'
										: errors.cin
										? 'destructive'
										: 'default'
								}
								icon={
									verificationStatus === 'success' && (
										<CircleCheck className='min-h-5 min-w-5 text-green-dark' />
									)
								}
							/>
							{errors.cin && (
								<p className='text-red-500 text-sm mt-1'>{errors.cin.message}</p>
							)}
						</>
					) : (
						<>
							<FileInput
								placeholder='Upload incorporation documents (PDF/DOC)'
								onChange={handleFileChange}
							/>
							{errors.documentFile && (
								<p className='text-red-500 text-sm mt-1'>
									{errors.documentFile.message as string}
								</p>
							)}
							<p className='text-sm text-gray-500 mt-1'>
								Supported formats: PDF, DOC, DOCX
							</p>
						</>
					)}

					<Button
						type='submit'
						disabled={!isValid || isSubmitting || verificationStatus === 'verifying'}
						className='w-full'
						loading={isSubmitting || verificationStatus === 'verifying'}
					>
						{isSubmitting || verificationStatus === 'verifying'
							? 'Verifying...'
							: registrationMethod === 'cin'
							? 'Verify Business'
							: 'Upload & Register'}
					</Button>
				</form>
				{verificationStatus === 'verifying' && registrationMethod === 'document' ? (
					<TextCard loading title='Analyzing Document' description='' />
				) : (
					documentAnalysis && (
						<>
							<TextCard
								title={documentAnalysis.data?.company_name || 'Document Analysis'}
								description={documentAnalysis.data?.analysis || ''}
								content={
									<div className='flex flex-col gap-2 text-body3 text-grey'>
										<p>CIN: {documentAnalysis.data?.cin}</p>
										<p>Company Name: {documentAnalysis.data?.company_name}</p>
										<p>PAN: {documentAnalysis.data?.pan}</p>
										<p>Address: {documentAnalysis.data?.registered_address}</p>
									</div>
								}
							/>
							<Button
								onClick={() => {
									router.push('/verify?role=owner');
								}}
							>
								Continue to Business Profile
							</Button>
						</>
					)
				)}
			</div>
		</div>
	);
}
