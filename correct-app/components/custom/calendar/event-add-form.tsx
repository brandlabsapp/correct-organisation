'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DateTimePicker } from './date-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { initialCategories } from '@/data/static/checklist';
import { useUserAuth } from '@/contexts/user';
import { Loader2 } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';
import { enUS } from 'date-fns/locale';

const eventAddFormSchema = z.object({
	id: z.number().optional(),
	title: z
		.string({ required_error: 'Please enter a title.' })
		.min(1, { message: 'Must provide a title for this event.' }),
	description: z
		.string({ required_error: 'Please enter a description.' })
		.min(1, { message: 'Must provide a description for this event.' }),
	category: z.string({
		required_error: 'Please select a category.',
	}),
	start: z.date({
		required_error: 'Please select a start time',
		invalid_type_error: "That's not a date!",
	}),
	end: z
		.date({
			required_error: 'Please select an end time',
			invalid_type_error: "That's not a date!",
		})
		.refine((data) => data > new Date(), {
			message: 'End time must be after start time',
		}),
});

type EventAddFormValues = z.infer<typeof eventAddFormSchema>;

interface EventAddFormProps {
	start?: Date;
	end?: Date;
	addTask: (task: EventAddFormValues) => void;
}

export function EventAddForm({ start, end, addTask }: EventAddFormProps) {
	const [open, setOpen] = useState(false);
	const { user, company } = useUserAuth();

	const { toast } = useToast();

	const form = useForm<z.infer<typeof eventAddFormSchema>>({
		resolver: zodResolver(eventAddFormSchema),
	});

	useEffect(() => {
		form.reset({
			title: '',
			description: '',
			category: '',
			start: new Date(),
			end: new Date(),
		});
	}, [form, start, end]);

	async function onSubmit(data: EventAddFormValues) {
		if (!user || !company) {
			showErrorToast({
				title: 'Error adding event!',
				message: 'Error adding event!',
			});
			return;
		}

		const newEvent = {
			title: data.title,
			description: data.description,
			category: data.category,
			start: data.start,
			end: data.end,
			companyId: company?.id,
			userId: user?.id,
		};

		const response = await fetch('/api/checklist', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newEvent),
		});
		const result = await response.json();
		if (result.state === 'error') {
			showErrorToast({
				title: 'Error adding event!',
				message: result.message,
			});
			return;
		}
		addTask({
			...newEvent,
			id: result.data.id,
		});
		form.reset();
		setOpen(false);	
		showSuccessToast({
			title: 'Event added!',
			message: 'Event added successfully',
		});
	}

	return (
		<AlertDialog open={open}>
			<AlertDialogTrigger className='flex' asChild>
				<Button
					className='w-full md:w-full text-xs md:text-sm'
					variant='default'
					onClick={() => setOpen(true)}
				>
					<PlusIcon className='md:h-5 md:w-5 h-3 w-3' />
					<p>Add Task</p>
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent className='min-h-screen md:min-h-fit'>
				<AlertDialogHeader>
					<AlertDialogTitle>Add Event</AlertDialogTitle>
				</AlertDialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2.5'>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder='Meeting with CA'
											className='text-xs md:text-sm'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Discuss the new compliance policy'
											className='max-h-36 text-xs md:text-sm'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='category'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue
													placeholder='Select a category'
													className='text-xs md:text-sm'
												/>
											</SelectTrigger>
											<SelectContent>
												{initialCategories.map((category) => (
													<SelectItem
														key={category.value}
														className='text-xs md:text-sm'
														value={category.value}
													>
														{category.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='start'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel htmlFor='datetime'>Start</FormLabel>
									<FormControl>
										<DateTimePicker
											value={field.value}
											onChange={field.onChange}
											hourCycle={12}
											granularity='minute'
											className='text-xs md:text-sm'
											locale={enUS}
											weekStartsOn={1}
											showWeekNumber={false}
											showOutsideDays={true}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='end'
							render={({ field }) => (
								<FormItem className='flex flex-col'>
									<FormLabel htmlFor='datetime'>End</FormLabel>
									<FormControl>
										<DateTimePicker
											value={field.value}
											onChange={field.onChange}
											hourCycle={12}
											granularity='minute'
											className='text-xs md:text-sm'
											locale={enUS}
											weekStartsOn={1}
											showWeekNumber={false}
											showOutsideDays={true}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* <FormField
							control={form.control}
							name='color'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Color</FormLabel>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild className='cursor-pointer'>
												<div className='flex flex-row w-full items-center space-x-2 pl-2'>
													<div
														className={`w-5 h-5 rounded-full cursor-pointer`}
														style={{ backgroundColor: field.value }}
													></div>
													<Input {...field} />
												</div>
											</PopoverTrigger>
											<PopoverContent className='flex mx-auto items-center justify-center'>
olorPicker
													className='flex'
													color={field.value}
													onChange={field.onChange}
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/> */}
						<AlertDialogFooter className='pt-2'>
							<AlertDialogCancel onClick={() => setOpen(false)}>
								Cancel
							</AlertDialogCancel>
							<AlertDialogAction type='submit' disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? (
									<>
										<Loader2 className='mr-2 h-4 w-4 animate-spin' />
										Adding...
									</>
								) : (
									'Add Event'
								)}
							</AlertDialogAction>
						</AlertDialogFooter>
					</form>
				</Form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
