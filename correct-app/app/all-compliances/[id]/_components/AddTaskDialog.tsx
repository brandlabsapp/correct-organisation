'use client';

import { useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import TagCard from './tag';
import AssigneesDropdown from './AssigneesDropdown';
import { useUserAuth } from '@/contexts/user';

interface TaskFormInputs {
	title: string;
	dueDate: Date | undefined;
	assignees: AppTypes.Member[];
}

export interface NewTaskData {
	title: string;
	dueDate: string;
	assignees: number[];
	assignedBy: number | null;
	status: string;
	description: string;
	complianceId: number;
	deadline: string;
	companyId: number | null;
}

export interface EditableTask {
	id: number;
	title: string;
	dueDate: string;
	assignees: number[];
	description: string;
	docs?: { name: string; url: string }[];
}

interface AddTaskDialogProps {
	onTaskSubmit: (taskData: Partial<NewTaskData> & { id?: number }) => void;
	taskToEdit?: EditableTask | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

export default function AddTaskDialog({
	onTaskSubmit,
	taskToEdit,
	isOpen,
	setIsOpen,
}: AddTaskDialogProps) {
	const { members, company, user } = useUserAuth();
	console.log('taskToEdit', taskToEdit);
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TaskFormInputs>({
		defaultValues: {
			title: '',
			dueDate: undefined,
			assignees: [],
		},
	});
	const dateInputRef = useRef<HTMLInputElement>(null);

	const isEditMode = taskToEdit !== undefined;

	useEffect(() => {
		if (isOpen) {
			if (taskToEdit) {
				reset({
					title: taskToEdit.title || '',
					dueDate: taskToEdit.dueDate
						? new Date(taskToEdit.dueDate.replace(/-/g, '/'))
						: undefined,
					assignees:
						taskToEdit.assignees?.map((assignee) => ({
							user: { id: assignee },
						})) || [],
				});
			} else {
				reset({
					title: '',
					dueDate: undefined,
					assignees: [],
				});
			}
		}
	}, [taskToEdit, isOpen, reset]);

	const onSubmit = (data: TaskFormInputs) => {
		const taskData = {
			title: data.title,
			dueDate: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : '',
			assignees: data.assignees.map((assignee) => assignee.user.id),
			assignedBy: user?.id || null,
			status: 'pending',
			description: '',
			complianceId: 0,
			deadline: '',
			companyId: company?.id || null,
			// file: data.file,
		};
		if (isEditMode) {
			onTaskSubmit({ ...taskData, id: taskToEdit?.id });
		} else {
			onTaskSubmit(taskData);
		}
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className='max-w-[400px] bg-white p-4 rounded-lg'>
				<DialogHeader>
					<DialogTitle>{isEditMode ? 'Edit Task' : 'Add Task'}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4 py-2'>
					<div>
						<Label htmlFor='task-title-dialog'>Task Title</Label>
						<Input
							id='task-title-dialog'
							placeholder='Board Resolution for Appointment'
							className='border border-gray-200 rounded-md p-2 w-full'
							{...register('title', { required: 'Task title is required.' })}
						/>
						{errors.title && (
							<p className='text-sm text-red-500 mt-1'>{errors.title.message}</p>
						)}
					</div>
					<div>
						<Label>Due Date</Label>
						<Controller
							control={control}
							name='dueDate'
							rules={{ required: 'Due date is required.' }}
							render={({ field }) => (
								<>
									<div
										className='border border-gray-200 rounded-md p-2 w-full flex items-center justify-between cursor-pointer'
										onClick={() => dateInputRef.current?.showPicker()}
									>
										<span className={!field.value ? 'text-gray-400' : ''}>
											{field.value ? format(field.value, 'dd/MM/yyyy') : 'dd/mm/yyyy'}
										</span>
										<Input
											ref={dateInputRef}
											id='due-date-dialog'
											type='date'
											className='sr-only'
											value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
											onChange={(e) =>
												field.onChange(
													e.target.value
														? new Date(e.target.value.replace(/-/g, '/'))
														: undefined
												)
											}
										/>
									</div>
									{errors.dueDate && (
										<p className='text-sm text-red-500 mt-1'>{errors.dueDate.message}</p>
									)}
								</>
							)}
						/>
					</div>
					<div>
						<Label>Assign</Label>
						<Controller
							control={control}
							name='assignees'
							rules={{
								validate: (value) =>
									value.length > 0 || 'At least one assignee is required.',
							}}
							render={({ field }) => (
								<>
									<div className='space-y-2'>
										<div className='border rounded-md p-3 min-h-[60px] bg-gray-50'>
											<div className='flex flex-wrap gap-2 items-center'>
												{field.value.map((assignee) => (
													<TagCard
														key={assignee.user.id}
														assignee={assignee}
														removeAssignee={(id) =>
															field.onChange(field.value.filter((a) => a.user.id !== id))
														}
													/>
												))}
												<AssigneesDropdown
													availableUsers={members}
													addAssignee={(user) => {
														if (!field.value.find((a) => a.user.id === user.user.id)) {
															field.onChange([...field.value, user]);
														}
													}}
												/>
											</div>
										</div>
									</div>
									{errors.assignees && (
										<p className='text-sm text-red-500 mt-1'>
											{errors.assignees.message}
										</p>
									)}
								</>
							)}
						/>
					</div>
					{isEditMode && taskToEdit?.docs && taskToEdit.docs.length > 0 && (
						<div>
							<Label>Existing Attachments</Label>
							<div className='mt-2 space-y-2'>
								{taskToEdit.docs.map((doc, index) => (
									<div
										key={index}
										className='flex items-center justify-between rounded-md border p-2'
									>
										<span className='truncate pr-2'>{doc.name}</span>
										<a
											href={doc.url}
											target='_blank'
											rel='noopener noreferrer'
											className='text-blue-500 hover:text-blue-700'
										>
											<Download className='h-5 w-5' />
										</a>
									</div>
								))}
							</div>
						</div>
					)}
					{/* <div>
						<Label htmlFor='task-file'>Attachment</Label>
						<Controller
							control={control}
							name='file'
							render={({ field }) => (
								<FileInput
									placeholder='Attach a file (optional)'
									onChange={(file) => field.onChange(file)}
								/>
							)}
						/>
					</div> */}
					<Button
						type='submit'
						className='w-full bg-gray-900 hover:bg-gray-800 text-white'
					>
						{isEditMode ? 'Update Task' : 'Add Task'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
