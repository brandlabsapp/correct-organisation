'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, User, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AddTaskDialog, { EditableTask, NewTaskData } from './AddTaskDialog';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import Image from 'next/image';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface Task {
	id: number;
	title: string;
	dueDate: string;
	assignees: number[];
	completed: boolean;
	deadline: string;
	description?: string;
	docs?: { name: string; url: string }[];
}

interface User {
	name: string;
	avatar: string;
}

interface TasksSectionProps {
	initialTasks: Task[];
	availableUsers: User[];
	// TODO: fix this type
	compliance: any;
}

export default function TasksSection({
	initialTasks,
	availableUsers,
	compliance,
}: TasksSectionProps) {
	const [isOpen, setIsOpen] = useState(true);
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [taskToEdit, setTaskToEdit] = useState<Task | undefined>();

	const handleSubmitTask = async (
		taskData: Partial<NewTaskData> & { id?: number }
	) => {
		try {
			const isEditMode = taskData.id !== undefined;
			const payload = {
				title: taskData.title,
				description: taskData.description,
				assignedToIds: taskData.assignees,
				assignedById: taskData.assignedBy,
				status: taskData.status,
				dueDate: new Date(taskData.dueDate!).toISOString(),
				completed: 'false',
				complianceId: compliance.compliance.id,
				companyChecklistId: compliance.id,
				deadline: taskData.deadline,
				companyId: taskData.companyId,
			};

			const url = isEditMode ? `/api/tasks/${taskData.id}` : '/api/tasks';
			const method = isEditMode ? 'PUT' : 'POST';

			const response = await fetch(url, {
				method: method,
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				showSuccessToast({
					title: `Task ${isEditMode ? 'updated' : 'added'}`,
					message: `The task has been ${
						isEditMode ? 'updated' : 'created'
					} successfully`,
				});
				const updatedTask = await response.json();
				if (isEditMode) {
					setTasks(
						tasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
					);
				} else {
					setTasks([...tasks, updatedTask]);
				}
			} else {
				showErrorToast({
					title: `Failed to ${isEditMode ? 'update' : 'create'} task`,
					message: `The task has not been ${isEditMode ? 'updated' : 'created'}`,
				});
			}
		} catch (error) {
			showErrorToast({
				title: 'An error occurred',
				message: 'An unexpected error occurred.',
			});
		}
	};

	const handleEditClick = (task: Task) => {
		console.log('task', task);
		setTaskToEdit(task);
		setIsDialogOpen(true);
	};

	const handleAddTaskClick = () => {
		setTaskToEdit(undefined);
		setIsDialogOpen(true);
	};

	console.log('tasks', tasks[0]);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className='flex items-center justify-between w-full px-5 bg-white rounded-lg'>
				<h2 className='font-semibold text-body1'>Tasks</h2>
				{isOpen ? (
					<ChevronUp className='w-5 h-5' />
				) : (
					<ChevronDown className='w-5 h-5' />
				)}
			</CollapsibleTrigger>
			<CollapsibleContent className='space-y-3 mt-3 px-5'>
				{tasks.map((task) => (
					<Card
						key={task.id}
						className='border-0 shadow-none bg-white cursor-pointer'
						onClick={() => handleEditClick(task)}
					>
						<CardContent className='p-4 bg-blue-light rounded-lg shadow-none'>
							<div className='flex items-center justify-between'>
								<div className='flex-1'>
									<h3 className='font-bold text-black mb-1 text-body1'>{task.title}</h3>
									<p className='text-body3 text-secondarygray-dark'>{task.deadline}</p>
									<p className='text-body3 text-secondarygray-dark'>
										Due: {format(new Date(), 'dd/MM/yyyy')}
									</p>
								</div>
								<div className='flex items-center gap-2'>
									<div className='flex -space-x-2'>
										{task.assignees.slice(0, 3).map((assignee, index) => (
											<Avatar
												key={index}
												className='w-6 h-6 border-2 border-white bg-white'
											>
												<AvatarImage className='object-cover ' src={'/placeholder.svg'} />
												<AvatarFallback className='bg-accent text-accent-foreground'>
													<User className='w-3 h-3' />
												</AvatarFallback>
											</Avatar>
										))}
										{task.assignees.length > 3 && (
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<Avatar className='w-6 h-6 border-2 border-white bg-gray-300'>
															<AvatarFallback className='text-[10px] font-medium text-white'>
																+{task.assignees.length - 3}
															</AvatarFallback>
														</Avatar>
													</TooltipTrigger>
													<TooltipContent>
														<p>All assignees ({task.assignees.length})</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										)}
									</div>
									{task.completed ? (
										<Image
											src='/assets/icons/correct-selected.svg'
											alt='completed'
											width={24}
											height={24}
											className='w-6 h-6 text-green-500'
										/>
									) : (
										<Image
											src='/assets/icons/correct.svg'
											alt='completed'
											width={24}
											height={24}
											className='w-6 h-6 text-green-500'
										/>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
				<Button onClick={handleAddTaskClick} className='w-full'>
					Add Task
				</Button>

				<AddTaskDialog
					isOpen={isDialogOpen}
					setIsOpen={setIsDialogOpen}
					onTaskSubmit={handleSubmitTask}
					taskToEdit={
						taskToEdit
							? {
									id: taskToEdit.id,
									title: taskToEdit.title,
									dueDate: taskToEdit.dueDate,
									assignees: taskToEdit.assignees,
									description: taskToEdit.description || '',
							  }
							: null
					}
				/>
			</CollapsibleContent>
		</Collapsible>
	);
}
