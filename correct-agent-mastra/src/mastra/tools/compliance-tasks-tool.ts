import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

type Task = {
	id: string;
	title: string;
	description?: string;
	dueDate?: string;
	assignedTo?: string;
	status: 'open' | 'in_progress' | 'done';
};

type Reminder = {
	id: string;
	message: string;
	remindAt: string;
};

const tasks: Task[] = [];
const reminders: Reminder[] = [];

let idSeq = 1;
const nextId = () => String(idSeq++).padStart(4, '0');

export const complianceTasksTool = createTool({
	id: 'compliance-tasks',
	description:
		'Manage compliance tasks and reminders (create, list, update, complete).',
	inputSchema: z.object({
		command: z
			.enum([
				'create_task',
				'list_tasks',
				'complete_task',
				'create_reminder',
				'list_reminders',
			])
			.describe('Action to perform'),
		title: z.string().optional(),
		description: z.string().optional(),
		dueDate: z.string().optional(),
		assignedTo: z.string().optional(),
		taskId: z.string().optional(),
		remindAt: z.string().optional(),
		message: z.string().optional(),
	}),
	outputSchema: z.object({
		ok: z.boolean(),
		result: z.any().optional(),
		message: z.string().optional(),
	}),
	execute: async ({ context }) => {
		switch (context.command) {
			case 'create_task': {
				if (!context.title) {
					return { ok: false, message: 'title is required to create_task' };
				}
				const task: Task = {
					id: nextId(),
					title: context.title,
					description: context.description,
					dueDate: context.dueDate,
					assignedTo: context.assignedTo,
					status: 'open',
				};
				tasks.push(task);
				return { ok: true, result: task };
			}

			case 'list_tasks': {
				return { ok: true, result: tasks.slice() };
			}

			case 'complete_task': {
				if (!context.taskId) {
					return { ok: false, message: 'taskId is required to complete_task' };
				}
				const t = tasks.find((x) => x.id === context.taskId);
				if (!t) return { ok: false, message: 'task not found' };
				t.status = 'done';
				return { ok: true, result: t };
			}

			case 'create_reminder': {
				if (!context.remindAt || !context.message) {
					return {
						ok: false,
						message: 'remindAt and message are required to create_reminder',
					};
				}
				const reminder: Reminder = {
					id: nextId(),
					message: context.message,
					remindAt: context.remindAt,
				};
				reminders.push(reminder);
				return { ok: true, result: reminder };
			}

			case 'list_reminders': {
				return { ok: true, result: reminders.slice() };
			}
			default: {
				return { ok: false, message: 'unknown command' };
			}
		}
	},
});
