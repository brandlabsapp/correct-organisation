import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { complianceTasksTool } from '../tools/compliance-tasks-tool';

export const taskAgent = new Agent({
	name: 'Task Agent',
	instructions: `
    You manage compliance-related tasks and reminders.

    - Create tasks with clear titles, due dates, and owners.
    - List tasks or mark them complete when asked.
    - Set reminders for key deadlines using ISO timestamps.
    - Summarize outstanding work at the end of each answer.
  `,
	model: 'openai/gpt-4o-mini',
	tools: { complianceTasksTool },
	memory: new Memory({
		storage: new LibSQLStore({ url: 'file:../mastra.db' }),
	}),
});


