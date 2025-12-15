import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { knowledgeBaseTool } from '../tools/knowledge-base-tool';

export const knowledgeAgent = new Agent({
	name: 'Knowledge Base Agent',
	instructions: `
    You manage user/company memory and facts.

    - Recall facts using precise keys. If not found, ask to store new facts.
    - When storing, choose stable, human-readable keys (e.g., faq:refund_policy, user:preferred_name).
    - Return concise answers, and show the stored value when recalling.
  `,
	model: 'openai/gpt-4o-mini',
	tools: { knowledgeBaseTool },
	memory: new Memory({
		storage: new LibSQLStore({ url: 'file:../mastra.db' }),
	}),
});


