'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { showSuccessToast } from '@/lib/utils/toast-handlers';

interface Task {
	id: number;
	title: string;
	status: 'urgent' | 'normal' | 'completed';
	dueDate: string;
}

export function PriorityTasks() {
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: 1,
			title: 'Submit Q2 Tax Returns',
			status: 'urgent',
			dueDate: '2023-07-31',
		},
		{
			id: 2,
			title: 'Update Employee Handbook',
			status: 'normal',
			dueDate: '2023-08-15',
		},
		{
			id: 3,
			title: 'Renew Business License',
			status: 'completed',
			dueDate: '2023-07-01',
		},
	]);

	const handleTaskCompletion = (taskId: number) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId
					? { ...task, status: task.status === 'completed' ? 'normal' : 'completed' }
					: task
			)
		);
		showSuccessToast({
			title: 'Task Updated',
			message: 'The task status has been updated.',
		});
	};

	return (
		<Card className='bg-lightgray p-5 text-black'>
			<CardHeader>
				<CardTitle>Priority Tasks</CardTitle>
				<CardDescription className='my-2'>
					Your most important compliance tasks
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ul className='space-y-5'>
					{tasks.map((task) => (
						<li
							key={task.id}
							className='flex flex-col items-center justify-between p-4 bg-white rounded-lg'
						>
							<div className='flex items-center justify-between w-full space-x-4'>
								<div className='flex items-center space-x-4'>
									<Checkbox
										checked={task.status === 'completed'}
										className='min-h-5 min-w-5 bg-lightgray-dark'
										onCheckedChange={() => handleTaskCompletion(task.id)}
										aria-label={`Mark ${task.title} as ${
											task.status === 'completed' ? 'incomplete' : 'complete'
										}`}
									/>
									{task.status === 'urgent' && (
										<AlertCircle className='min-h-5 min-w-5 text-red-500' />
									)}
									{task.status === 'normal' && (
										<Clock className='min-h-5 min-w-5 text-yellow-500' />
									)}
									{task.status === 'completed' && (
										<CheckCircle className='min-h-5 min-w-5 text-green-500' />
									)}
								</div>
								<div>
									<p
										className={`font-medium text-body3 ${
											task.status === 'completed'
												? 'line-through text-muted-foreground'
												: ''
										}`}
									>
										{task.title}
									</p>
									<p className='text-sm text-muted-foreground'>Due: {task.dueDate}</p>
								</div>
							</div>
							<Button size='sm' className='w-full mt-5'>
								View
							</Button>
						</li>
					))}
				</ul>
			</CardContent>
		</Card>
	);
}
