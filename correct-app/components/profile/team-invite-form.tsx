'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
	phone: z.string().min(1, 'Phone number is required'),
	role: z.enum(['admin', 'member']).default('member'),
});

type FormValues = z.infer<typeof formSchema>;

export function TeamInviteForm({
	onSubmit,
	onSuccess,
}: {
	onSubmit: (values: FormValues) => Promise<void>;
	onSuccess?: () => void;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		setValue,
		getValues,
		reset,
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { phone: '', role: 'member' },
	});

	const handleFormSubmit = async (values: FormValues) => {
		try {
			await onSubmit(values);
			reset();
			onSuccess?.();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={handleSubmit(handleFormSubmit)}>
			<div className='space-y-2'>
				<div className='flex px-2 gap-x-2'>
					<div className='w-full'>
						<Input
							id='phone'
							type='tel'
							placeholder='Enter Phone Number..'
							className='text-sm md:text-base w-full'
							{...register('phone')}
						/>
						{errors.phone && (
							<span className='text-red-500 text-sm'>{errors.phone.message}</span>
						)}
					</div>
					<div className='w-full md:w-1/2 ml-0!'>
						<Select
							onValueChange={(value) => setValue('role', value as 'admin' | 'member')}
							defaultValue={getValues('role')}
						>
							<SelectTrigger>
								<SelectValue placeholder='Role' />
							</SelectTrigger>
							<SelectContent className='text-sm md:text-base'>
								<SelectItem value='admin'>Admin</SelectItem>
								<SelectItem value='member'>Member</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<Button
					disabled={isSubmitting}
					loading={isSubmitting}
					type='submit'
					className='w-full'
				>
					Invite
				</Button>
			</div>
		</form>
	);
}
