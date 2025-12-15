import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { knowledgeBaseTool } from '../tools/knowledge-base-tool';
import { serpApiSearchTool } from '../tools/serpapi-search-tool';

export const generalAgent = new Agent({
	name: 'General Queries Agent',
	instructions: `
    You handle greetings, introductions, and basic FAQs. 

    Guidance:
    - Prefer recalling answers from the knowledge base for FAQs.
    - Use web search when the question requires external information.
    - When the user shares stable facts (names, preferences, company FAQs), store them in the knowledge base using clear keys.
    - Keep responses concise and friendly; include citations for searched info.
  `,
	model: 'openai/gpt-4o-mini',
	tools: { knowledgeBaseTool, serpApiSearchTool },
	memory: new Memory({
		storage: new LibSQLStore({ url: 'file:../mastra.db' }),
	}),
});
