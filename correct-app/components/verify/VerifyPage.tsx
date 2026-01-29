'use client';
import { useUserAuth } from '@/contexts/user';
import React, { useState, useCallback, useMemo } from 'react';
import { TextCard } from '../common/TextCard';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FileInput } from '../common/FileInput';
import { roleToDocumentMap, getSelectOptions } from '@/data/static/onboarding';
import { toast } from '@/hooks/use-toast';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import { useRouter } from 'next/navigation';
import { uploadFileToSupabaseClient } from '@/app/lib/supabase/supabase-db';
// Replaced moment with date-fns for better tree-shaking and smaller bundle size
import { format } from 'date-fns';

interface VerifyBusinessAndRoleProps {
	role: 'consultant' | 'owner';
}

const VerifyBusinessAndRole = ({ role }: VerifyBusinessAndRoleProps) => {
	const { company, user } = useUserAuth();
	const [selectedRole, setSelectedRole] = useState<string>('');
	const [documentValue, setDocumentValue] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const currentRoleDocumentMap = useMemo(() => roleToDocumentMap(role), [role]);
	const selectOptions = useMemo(() => getSelectOptions(role), [role]);

	const companyDisplayData = useMemo(
		() => ({
			name: company?.name || 'Vitra Innovations Private Limited',
			type: company?.type || 'Company limited by shares',
			incorporationDate: company?.incorporationDate
				? `since ${format(new Date(company.incorporationDate), 'PP')}` // PP format = "Apr 29, 2023" (equivalent to moment's 'll')
				: '',
			tags: ['ROC Mumbai'],
		}),
		[company]
	);

	const validateForm = useCallback(() => {
		if (!selectedRole || !documentValue) {
			toast({
				title: 'Missing Information',
				description: 'Please fill in all required fields',
				variant: 'destructive',
			});
			return false;
		}
		return true;
	}, [selectedRole, documentValue]);

	const handleFileUpload = async (file: File) => {
		async (file: File) => {
			const payload = {
				size: file.size,
				category: 'compliance' as const,
				fileName: String(file.name),
				extension: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
				filetype: file.type,
				folderId: null,
				tags: ['compliance'],
				userId: user?.id,
				companyId: company?.id,
			};

			const uploadResult = await uploadFileToSupabaseClient(
				file,
				company?.id ?? 'verification',
				null,
				file.name
			);

			if (!uploadResult.success) {
				throw new Error(
					uploadResult.message || 'Failed to upload file to Supabase'
				);
			}

			return {
				url: uploadResult.url,
				...payload,
				name: file.name,
				key: uploadResult.key,
			};
		};
	};
	const prepareDocumentData = async () => {
		const documentType = currentRoleDocumentMap[selectedRole];

		if (documentType.type === 'file') {
			const file = documentValue as unknown as File;
			return await handleFileUpload(file);
		}

		return {
			value: documentValue,
			type: documentType.id,
		};
	};

	const submitVerification = async (documentData: any) => {
		const response = await fetch('/api/onboarding/verify-role', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: user?.id,
				companyId: company?.id,
				role: selectedRole,
				data: documentData,
			}),
		});

		const data = await response.json();
		if (!data.success) {
			throw new Error(data.message || 'Failed to verify role');
		}
		return data;
	};

	const handleKYC = async () => {
		if (!validateForm()) return;

		setIsLoading(true);
		try {
			const documentData = await prepareDocumentData();
			await submitVerification(documentData);

			showSuccessToast({
				title: 'Success',
				message: 'Role verification submitted successfully',
			});

			router.push('/onboarding/individual-kyc');
		} catch (error) {
			console.error('Error in handleKYC:', error);
			showErrorToast({
				title: 'Error',
				message:
					error instanceof Error ? error.message : 'Failed to submit verification',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleRoleChange = (value: string) => {
		setSelectedRole(value);
		setDocumentValue('');
	};

	const handleDocumentValueChange = (value: string | File) => {
		setDocumentValue(value as string);
	};

	return (
		<main className='min-h-screen bg-white'>
			<div className='px-5 md:mx-auto  md:px-4 md:sm:px-6 md:lg:px-8 md:py-4 md:lg:py-6'>
				<div className='md:max-w-xl md:mx-auto'>
					<header className='mb-4 lg:mb-6'>
						<h1 className='text-body1 md:text-heading3 lg:text-heading2 font-bold text-black'>
							Verify business and your role
						</h1>
					</header>

					{/* Content Section - Reduced spacing */}
					<div className='space-y-4 lg:space-y-5'>
						{/* Company Information Card */}
						<section aria-labelledby='company-info'>
							<h2 id='company-info' className='sr-only'>
								Company Information
							</h2>
							<TextCard
								title={companyDisplayData.name}
								background='bg-beige'
								description={companyDisplayData.type}
								subDescription={companyDisplayData.incorporationDate}
								tags={companyDisplayData.tags}
							/>
						</section>

						{/* Role Selection Section - Compact */}
						<section aria-labelledby='role-selection' className='space-y-2'>
							<h2
								id='role-selection'
								className='text-body2 lg:text-body1 text-black font-medium'
							>
								What is your role at the company?
							</h2>
							<Select value={selectedRole} onValueChange={handleRoleChange}>
								<SelectTrigger
									className='border-black h-10 lg:h-11 text-sm'
									aria-label='Select your role at the company'
								>
									<SelectValue placeholder='Select your role' />
								</SelectTrigger>
								<SelectContent>
									{selectOptions.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</section>

						{selectedRole && currentRoleDocumentMap[selectedRole] && (
							<section aria-labelledby='document-section' className='space-y-2'>
								<h2
									id='document-section'
									className='text-body2 lg:text-body1 text-black font-medium'
								>
									{currentRoleDocumentMap[selectedRole].title}
								</h2>
								{currentRoleDocumentMap[selectedRole].type === 'file' ? (
									<FileInput
										placeholder={currentRoleDocumentMap[selectedRole].placeholder}
										onChange={handleDocumentValueChange}
										aria-describedby='file-help'
									/>
								) : (
									<Input
										type='text'
										className='w-full h-10 lg:h-11 text-sm border-black'
										placeholder={currentRoleDocumentMap[selectedRole].placeholder}
										value={documentValue}
										onChange={(e) => handleDocumentValueChange(e.target.value)}
										aria-describedby='input-help'
									/>
								)}
								<div id='file-help' className='sr-only'>
									Upload the required document for verification
								</div>
								<div id='input-help' className='sr-only'>
									Enter the required information for verification
								</div>
							</section>
						)}

						<section className='pt-2 lg:pt-3'>
							<Button
								className='w-full bg-black text-white hover:bg-gray-dark h-10 lg:h-11 text-sm lg:text-base font-medium transition-colors duration-200'
								onClick={handleKYC}
								disabled={isLoading}
								aria-describedby='submit-help'
							>
								{isLoading ? 'Processing...' : 'Continue with KYC'}
							</Button>
							<div id='submit-help' className='sr-only'>
								Submit your role verification to continue with KYC process
							</div>
						</section>
					</div>
				</div>
			</div>
		</main>
	);
};

export default VerifyBusinessAndRole;
