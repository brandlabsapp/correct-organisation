'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import { useAdminContext } from '@/contexts/admin';

const formSchema = z.object({
	phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
		message: 'Please enter a valid phone number.',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters long.',
	}),
});

export default function AdminLoginForm() {
	const router = useRouter();
	const { login, logout, updateAdmin } = useAdminContext();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			phone: '',
			password: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const response = await fetch('/api/admin/login', {
			method: 'POST',
			body: JSON.stringify(values),
		});
		const data = await response.json();
		console.log(data);
		if (data.success) {
			showSuccessToast({
				title: 'Admin login successful',
				message: 'You are now logged in as an admin.',
			});
			login(data.data);
			router.push('/admin/compliances');
		} else {
			showErrorToast({
				error: data,
			});
		}
	};

	return (
		<div className='flex justify-center items-center h-[calc(100vh-3.7rem)] bg-white'>
			<Card className='w-[350px] bg-white shadow-none space-y-4'>
				<CardHeader>
					<CardTitle className='text-center text-heading2 font-bold'>
						Admin Login
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-8 bg-white'
						>
							<FormField
								control={form.control}
								name='phone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input
												placeholder='+1234567890'
												{...field}
												width='full'
												variant='default'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type='password'
												placeholder='••••••••'
												{...field}
												width='full'
												variant='default'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' className='w-full'>
								Login
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
