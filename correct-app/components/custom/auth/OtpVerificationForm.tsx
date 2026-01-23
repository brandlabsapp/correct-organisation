import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { MAX_RESEND_ATTEMPTS } from '@/utils/constants/constant';

const OtpFormSchema = z.object({
	pin: z.string().min(6, 'Your one-time password must be 6 characters.'),
});

type OtpFormValues = z.infer<typeof OtpFormSchema>;

const OtpVerificationForm = ({
	onSubmit,
	onBack,
	onResend,
	isLoading,
	countdown,
	resendAttempts,
}: {
	onSubmit: (data: OtpFormValues) => void;
	onBack: () => void;
	onResend: () => void;
	isLoading: boolean;
	countdown: number;
	resendAttempts: number;
}) => {
	const form = useForm<OtpFormValues>({
		resolver: zodResolver(OtpFormSchema),
		defaultValues: { pin: '' },
	});

	const resendLimitReached = resendAttempts >= MAX_RESEND_ATTEMPTS;
	const attemptsRemaining = MAX_RESEND_ATTEMPTS - resendAttempts;

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='w-full flex flex-col items-center justify-center rounded-2xl'
		>
			<div className='bg-white rounded-t-2xl lg:rounded-2xl lg:shadow-lg space-y-5 lg:space-y-6 p-3 lg:p-8 w-full'>
				<Button
					variant='link'
					className='text-green px-0 lg:mb-4 lg:hover:no-underline'
					onClick={onBack}
					disabled={isLoading}
				>
					<ChevronLeft className='w-4 h-4' />
					Back
				</Button>

				{/* Desktop-only header */}
				<div className='hidden lg:block mb-6'>
					<h3 className='text-xl lg:text-2xl font-semibold text-gray-900 mb-2'>
						Verify your phone
					</h3>
					<p className='text-gray-600'>Enter the 6-digit code sent to your phone</p>
				</div>

				<div className='flex w-full lg:justify-center lg:space-y-6'>
					<InputOTP
						maxLength={6}
						onChange={(value) => form.setValue('pin', value)}
						disabled={isLoading}
						pattern={REGEXP_ONLY_DIGITS}
					>
						<InputOTPGroup className='justify-between gap-2 lg:gap-3'>
							{Array.from({ length: 6 }, (_, i) => (
								<InputOTPSlot
									className='w-10 h-10 md:w-16 md:h-12 lg:w-14 lg:h-14 text-black lg:text-lg lg:font-medium lg:border-2 lg:rounded-lg'
									index={i}
									key={i}
								/>
							))}
						</InputOTPGroup>
					</InputOTP>
				</div>

				{form.formState.errors.pin && (
					<p className='text-red-500 mt-2 lg:text-sm lg:text-center'>
						{form.formState.errors.pin.message}
					</p>
				)}

				<Button
					type='submit'
					className='w-full lg:py-4 lg:text-base lg:font-medium'
					loading={isLoading}
					disabled={isLoading}
				>
					{isLoading ? 'Verifying...' : 'Verify OTP'}
				</Button>

				<div className='text-center'>
					{countdown > 0 ? (
						<p className='text-secondarygray lg:text-sm'>
							Resend OTP in {countdown} seconds
						</p>
					) : resendLimitReached ? (
						<p className='text-red-600 lg:text-sm'>
							Maximum attempts reached. Please try again later.
						</p>
					) : (
						<Button
							variant='link'
							onClick={onResend}
							disabled={isLoading}
							className='lg:text-green lg:hover:underline lg:p-0 lg:h-auto lg:font-normal'
						>
							Resend OTP ({attemptsRemaining} attempts remaining)
						</Button>
					)}
				</div>
			</div>
		</form>
	);
};

export default OtpVerificationForm;
