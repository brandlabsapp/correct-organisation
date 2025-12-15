'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { CompanyForm } from './table/column';
import { useCallback, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MultiFileInput } from '@/components/common/MultiFileInput';
import { Calendar22 } from '@/components/common/Calendar';

const formSchema = z
	.object({
		srNo: z.number().positive().min(1, 'Sr. No. must be at least 1'),
		title: z.string().min(2, 'Form name must be at least 2 characters'),
		state: z.string().min(2, 'State must be at least 2 characters'),
		category: z.string().min(2, 'Category must be at least 2 characters'),
		applicability: z
			.string()
			.min(2, 'Applicability must be at least 2 characters'),
		purpose: z.string().min(2, 'Purpose must be at least 2 characters'),
		dueDateRule: z.string({ required_error: 'Due date is required' }),
		penalties: z.string().min(2, 'Penalties must be at least 2 characters'),
		section: z.string().min(2, 'Section must be at least 2 characters'),
		rules: z.string().min(2, 'Rules must be at least 2 characters'),
		startDate: z.string({ required_error: 'Start date is required' }),
		endDate: z.string({ required_error: 'End date is required' }),
		documents: z.any().optional(),
	})
	.superRefine((data, ctx) => {
		if (data.endDate <= data.startDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'End date must be after start date',
				path: ['endDate'],
			});
		}
	});

export type ComplianceFormData = z.infer<typeof formSchema>;

interface AddFormProps {
	onAddForm: (form: CompanyForm) => void;
	serialNo: number;
}

export function ComplianceForm({ onAddForm, serialNo }: AddFormProps) {
	const firstInputRef = useRef<HTMLInputElement>(null);
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const form = useForm<ComplianceFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			srNo: serialNo,
			title: '',
			state: '',
			category: '',
			applicability: '',
			purpose: '',
			dueDateRule: '',
			penalties: '',
			section: '',
			rules: '',
			startDate: '',
			endDate: '',
			documents: null,
		},
	});

	const onSubmit = useCallback(
		async (values: ComplianceFormData) => {
			setIsSubmitting(true);
			const formData = new FormData();

			Object.entries(values).forEach(([key, value]) => {
				if (key === 'documents') return;
				if (value instanceof Date) {
					formData.append(key, value.toISOString());
				} else if (value) {
					formData.append(key, value);
				}
			});

			if (values.documents && values.documents.length > 0) {
				for (let i = 0; i < values.documents.length; i++) {
					formData.append('files', values.documents[i]);
				}
			}

			try {
				const response = await fetch('/api/compliances-list/create', {
					method: 'POST',
					body: formData,
				});

				const data = await response.json();
				if (response.ok) {
					toast({
						title: 'Success',
						description: 'Compliance form submitted successfully.',
					});
					onAddForm(data);
					form.reset();
					if (firstInputRef.current) {
						firstInputRef.current.focus();
					}
				} else {
					toast({
						title: 'Error',
						description: data.message || 'Something went wrong.',
						variant: 'destructive',
					});
				}
			} catch (error: any) {
				toast({
					title: 'Error',
					description: error?.message || 'An unexpected error occurred.',
					variant: 'destructive',
				});
			} finally {
				setIsSubmitting(false);
			}
		},
		[onAddForm, form, toast]
	);

	const renderTextField = (
		name: keyof ComplianceFormData,
		label: string,
		type: string = 'text',
		autoFocus = false,
		isDate = false
	) => (
		<FormField
			control={form.control}
			name={name as any}
			render={({ field }) => (
				<FormItem>
					<FormLabel htmlFor={name}>{label}</FormLabel>
					<FormControl>
						{isDate ? (
							<Calendar22 label={label} />
						) : (
							<Input
								{...field}
								type={type}
								id={name}
								ref={autoFocus ? firstInputRef : undefined}
								autoFocus={autoFocus}
								aria-required='true'
								disabled={isSubmitting}
								placeholder={label}
								width='full'
							/>
						)}
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);

	const renderFileInput = (name: keyof ComplianceFormData, label: string) => (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel htmlFor={name}>{label}</FormLabel>
					<FormControl>
						<MultiFileInput
							id={name}
							onValueChange={(files: File[]) => field.onChange(files)}
							disabled={isSubmitting}
							multiple
							placeholder='Upload compliance documents'
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);

	return (
		<div className='space-y-2 max-h-[400px] overflow-y-auto px-2'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-4'>
					<div className='grid gap-4 py-4'>
						{renderTextField('srNo', 'Sr. No.', 'number', true)}
						{renderTextField('title', 'Name of the form')}
						{renderTextField('state', 'State')}
						{renderTextField('category', 'Category')}
						{renderTextField('applicability', 'Applicability')}
						{renderTextField('purpose', 'Purpose')}
						{renderTextField('dueDateRule', 'Due Date')}
						{renderTextField('penalties', 'Penalties')}
						{renderTextField('section', 'Section as per Company Law')}
						{renderTextField('rules', 'Rules')}
						{renderTextField('startDate', 'Start Date', 'date', false, true)}
						{renderTextField('endDate', 'End Date', 'date', false, true)}
						{renderFileInput('documents', 'Upload Documents')}
					</div>
					<DialogFooter>
						<Button type='submit' disabled={isSubmitting} className='w-full'>
							{isSubmitting ? 'Saving...' : 'Save Form'}
						</Button>
					</DialogFooter>
				</form>
			</Form>
		</div>
	);
}
