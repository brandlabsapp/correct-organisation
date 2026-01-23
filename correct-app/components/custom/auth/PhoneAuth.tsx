'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import Image from 'next/image';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import { MAX_RESEND_ATTEMPTS } from '@/utils/constants/constant';
import useOtpCountdown from '@/hooks/use-countdown';
import OtpVerificationForm from './OtpVerificationForm';
import PhoneInputForm from './PhoneInput';
import { useUserAuth } from '@/contexts/user';

const PhoneFormSchema = z.object({
	phoneNumber: z.string().regex(/^\d{10}$/, 'Invalid phone number'),
});

const OtpFormSchema = z.object({
	pin: z.string().min(6, 'Your one-time password must be 6 characters.'),
});

type PhoneFormValues = z.infer<typeof PhoneFormSchema>;
type OtpFormValues = z.infer<typeof OtpFormSchema>;

const authService = {
	async sendOtp(phoneNumber: string) {
		const response = await fetch('/api/auth/send-otp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phoneNumber }),
		});

		if (!response.ok) {
			throw new Error('Failed to send OTP');
		}

		return response.json();
	},

	async verifyOtp(phoneNumber: string, otp: string, token?: string | null) {
		const response = await fetch('/api/auth/verify-otp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phoneNumber, otp, token }),
		});

		if (!response.ok) {
			throw new Error('Failed to verify OTP');
		}

		return response.json();
	},

	async resendOtp(phoneNumber: string) {
		const response = await fetch('/api/auth/resend-otp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phoneNumber }),
		});

		if (!response.ok) {
			throw new Error('Failed to resend OTP');
		}

		return response.json();
	},
};

export default function PhoneAuth() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
	const [resendAttempts, setResendAttempts] = useState<number>(0);
	const [phoneNumber, setPhoneNumber] = useState<string>('');
	const { countdown, resetCountdown } = useOtpCountdown(isOtpSent);

	const { login } = useUserAuth();
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get('token');
	const redirectParam = searchParams.get('redirect');

	const handlePhoneSubmit = async (data: PhoneFormValues) => {
		setIsLoading(true);
		showSuccessToast({
			title: 'Sending OTP',
			message: 'Please wait while we send an OTP to your phone number',
		});

		try {
			const result = await authService.sendOtp(data.phoneNumber);

			if (result.success) {
				setPhoneNumber(data.phoneNumber);
				showSuccessToast({ title: 'OTP Sent' });
				setIsOtpSent(true);
			} else {
				showErrorToast({ title: result.error, message: result.message });
			}
		} catch (error) {
			console.error('Error sending OTP:', error);
			showErrorToast({ error });
		} finally {
			setIsLoading(false);
		}
	};

	const handleOtpSubmit = async (data: OtpFormValues) => {
		setIsLoading(true);
		try {
			const result = await authService.verifyOtp(phoneNumber, data.pin, token);
			console.log(result);

			if (result.success) {
				showSuccessToast({
					title: 'Success',
					message: 'OTP verified successfully.',
				});
				const userData = result.data;
				const accessToken = userData.access_token;
				localStorage.setItem('Authentication', accessToken);
				if (userData.companyDetails && userData.companyDetails.length > 0) {
					localStorage.setItem('companyId', String(userData.companyDetails[0].id));
				}
				login({
					...userData,
					token: accessToken,
				});

				handleSuccessRedirect(result);
			} else {
				showErrorToast({
					title: 'Error',
					message: 'Invalid OTP. Please try again.',
				});
			}
		} catch (error) {
			console.error('Error verifying OTP:', error);
			showErrorToast({ error });
		} finally {
			setIsLoading(false);
		}
	};

	const handleSuccessRedirect = (result: any) => {
		if (redirectParam === 'ai-chat') {
			router.push('/ai-chat');
			return;
		}
		const loginSource = sessionStorage.getItem('loginSource');
		if (loginSource === 'ai-chat') {
			sessionStorage.removeItem('loginSource');
			router.push('/ai-chat');
			return;
		}
		if (token) {
			router.push('/dashboard');
		} else if (result.data?.companyDetails?.length > 0) {
			router.push('/onboarding/existing-companies');
		} else {
			router.push('/onboarding/user-type');
		}
	};

	const handleResendOtp = async () => {
		if (resendAttempts >= MAX_RESEND_ATTEMPTS) {
			showErrorToast({
				title: 'Maximum attempts reached',
				message: 'Please try again later or contact support.',
			});
			return;
		}

		setIsLoading(true);
		try {
			await authService.resendOtp(phoneNumber);

			setResendAttempts((prev) => prev + 1);
			resetCountdown();

			showSuccessToast({
				title: 'Success',
				message: `OTP resent successfully. ${
					MAX_RESEND_ATTEMPTS - resendAttempts - 1
				} attempts remaining.`,
			});
		} catch (error) {
			console.error('Error resending OTP:', error);
			showErrorToast({
				title: 'Error',
				message: 'Failed to resend OTP. Please try again.',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleBackToPhone = () => {
		setIsOtpSent(false);
	};

	return (
		<div className='h-screen flex flex-col lg:flex-row'>
			<div className='hidden lg:flex lg:w-1/2 bg-linear-to-br from-gray-900 to-black flex-col justify-center items-center p-12'>
				<Image
					src='/assets/logo/logo-black-white-title.svg'
					alt='logo'
					width={120}
					height={120}
					className='h-12 w-auto mb-8'
				/>
				<h1 className='text-center text-white text-4xl xl:text-5xl font-bold leading-tight'>
					Simple way of managing
					<br />
					<span className='text-green'>Compliances</span>
				</h1>
				<p className='text-gray-300 text-lg mt-6 text-center max-w-md'>
					Streamline your compliance management with our intuitive platform
				</p>
			</div>

			<div className='flex-1 lg:w-1/2 flex flex-col justify-center items-center  lg:p-12 lg:bg-gray-50'>
				<div className='lg:hidden flex flex-col items-center justify-center flex-1 mb-8'>
					<Image
						src='/assets/logo/logo-black-white-title.svg'
						alt='logo'
						width={100}
						height={100}
						className='mt-10 h-10 w-auto mb-6'
					/>
					<h2 className='text-center text-white text-heading2 md:text-subheading1 font-bold'>
						Simple way of managing
						<br />
						<span className='text-green'>Compliances</span>
					</h2>
				</div>

				<div className='w-full max-w-md lg:max-w-md'>
					{!isOtpSent ? (
						<PhoneInputForm onSubmit={handlePhoneSubmit} isLoading={isLoading} />
					) : (
						<OtpVerificationForm
							onSubmit={handleOtpSubmit}
							onBack={handleBackToPhone}
							onResend={handleResendOtp}
							isLoading={isLoading}
							countdown={countdown}
							resendAttempts={resendAttempts}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
