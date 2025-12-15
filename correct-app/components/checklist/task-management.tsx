'use client';

import { useState } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { EventAddForm } from '../custom/calendar/event-add-form';
// Replaced moment with date-fns for smaller bundle size
import { format } from 'date-fns';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';

export function TaskManagement({ data }: any) {
	const [tasks, setTasks] = useState<checklist.Task[]>(data);
	const [activeTab, setActiveTab] = useState('checklist');

	const addTask = (task: any) => {
		const newTask: checklist.Task = {
			...task,
			completed: false,
			status: 'pending',
			dueDate: new Date().toISOString().split('T')[0],
		};
		setTasks([...tasks, newTask]);
		showSuccessToast({
			title: 'Task added',
			message: 'New compliance task has been added to your list.',
		});
	};

	const toggleTask = async (id: number, status: 'pending' | 'completed') => {
		setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)));
		showSuccessToast({
			title: 'Task updated',
			message: `Compliance task has been updated to ${status}.`,
		});
		const response = await fetch(`/api/checklist/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ status }),
		});
		const result = await response.json();
		if (!result.success) {
			showErrorToast({
				title: 'Error',
				message: 'There was an error updating the task.',
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className='text-sm md:text-base'>Compliance Tasks</CardTitle>
				<CardDescription className='text-xs md:text-sm'>
					Manage your compliance-related tasks
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='checklist' className='text-xs md:text-sm'>
								Pending Tasks
							</TabsTrigger>
							<TabsTrigger value='done' className='text-xs md:text-sm'>
								Done
							</TabsTrigger>
						</TabsList>
						<TabsContent value='checklist' className='mt-4'>
							{tasks
								.filter((task) => task.status === 'pending')
								.map((task) => (
									<div key={task.id} className='flex items-center space-x-2'>
										<Checkbox
											id={String(task.id)}
											checked={task.status === 'completed'}
											onCheckedChange={() => toggleTask(task.id, 'completed')}
										/>
										<div className='flex-grow'>
											<Label
												htmlFor={String(task.id)}
												className={`${
													task.status === 'completed'
												} ? 'line-through text-muted-foreground' : ''
												}`}
											>
												{task.title || task?.compliance?.formName || 'Untitled'}
											</Label>
											<p className='text-sm text-muted-foreground'>
												{task.start && task.end
													? `${format(new Date(task.start), 'PPPP')} - ${format(new Date(task.end), 'PPPP')}`
													: 'No dates set'}
											</p>
										</div>
									</div>
								))}
						</TabsContent>
						<TabsContent value='done' className='mt-4'>
							{tasks
								.filter((task) => task.status === 'completed')
								.map((task) => (
									<div key={task.id} className='flex items-center space-x-2'>
										<Checkbox
											id={String(task.id)}
											checked={task.status === 'completed'}
											onCheckedChange={() => toggleTask(task.id, 'pending')}
										/>
										<div className='flex-grow'>
											<Label
												htmlFor={String(task.id)}
												className='line-through text-muted-foreground'
											>
												{task.title}
											</Label>
											<p className='text-sm text-muted-foreground'>
												{task.start && task.end
													? `${format(new Date(task.start), 'PPPP')} - ${format(new Date(task.end), 'PPPP')}`
													: 'No dates set'}
											</p>
										</div>
									</div>
								))}
						</TabsContent>
					</Tabs>
				</div>
			</CardContent>
			<CardFooter>
				<EventAddForm addTask={addTask} />
			</CardFooter>
		</Card>
	);
}
