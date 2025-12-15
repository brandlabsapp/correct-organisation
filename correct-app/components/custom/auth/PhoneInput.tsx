import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { COUNTRY_CODE } from '@/utils/constants/constant';
import Link from 'next/link';

const PhoneFormSchema = z.object({
	phoneNumber: z.string().regex(/^\d{10}$/, 'Invalid phone number'),
});

type PhoneFormValues = z.infer<typeof PhoneFormSchema>;

const PhoneInputForm = ({
	onSubmit,
	isLoading,
}: {
	onSubmit: (data: PhoneFormValues) => void;
	isLoading: boolean;
}) => {
	const form = useForm<PhoneFormValues>({
		resolver: zodResolver(PhoneFormSchema),
		defaultValues: { phoneNumber: '' },
	});

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className='w-full flex flex-col items-center justify-center rounded-2xl'
		>
			<div className='bg-white rounded-t-2xl lg:rounded-2xl lg:shadow-lg p-4 lg:p-8 w-full'>
				<div className='hidden lg:block mb-6'>
					<h3 className='text-xl lg:text-2xl font-semibold text-gray-900 mb-2'>
						Welcome back
					</h3>
					<p className='text-gray-600'>Enter your phone number to get started</p>
				</div>

				<div className='lg:space-y-4'>
					<div className='flex items-center border border-gray rounded-md lg:rounded-lg lg:overflow-hidden lg:focus-within:ring-2 lg:focus-within:ring-green lg:focus-within:border-green lg:transition-all'>
						<div className='bg-white lg:bg-gray-50 text-black text-body-1 font-medium pl-2 lg:px-4 lg:py-3 lg:border-r lg:border-gray'>
							{COUNTRY_CODE}
						</div>
						<Input
							id='phoneNumber'
							type='tel'
							placeholder='Enter your phone number'
							className='text-body-1 text-black md:text-base lg:text-base border-none placeholder:text-gray w-full lg:py-3 lg:px-4 lg:focus:ring-0'
							{...form.register('phoneNumber')}
							disabled={isLoading}
							autoComplete='tel'
						/>
					</div>

					{form.formState.errors.phoneNumber && (
						<p className='text-red-500 mt-2 lg:mt-0 lg:text-sm'>
							{form.formState.errors.phoneNumber.message}
						</p>
					)}

					<Button
						type='submit'
						className='mt-4 lg:mt-0 w-full lg:py-4 lg:text-base lg:font-medium'
						variant='default'
						disabled={isLoading}
					>
						{isLoading ? 'Sending...' : 'Send OTP'}
					</Button>
				</div>

				<div className='text-center text-sm mt-4 lg:mt-6 text-secondarygray lg:leading-relaxed'>
					By logging in, you agree to our{' '}
					<Link
						href='/terms-and-conditions'
						className='text-green lg:hover:underline'
					>
						Terms and Conditions
					</Link>{' '}
					and{' '}
					<Link href='/privacy-policy' className='text-green lg:hover:underline'>
						Privacy Policy
					</Link>
					.
				</div>
			</div>
		</form>
	);
};

export default PhoneInputForm;
