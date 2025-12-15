import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { serpApiSearchTool } from '../tools/serpapi-search-tool';

export const complianceAgent = new Agent({
	name: 'Compliance Agent',
	instructions: `
    You answer questions about regulations, laws, and standards.

    - Use SerpApi first for authoritative, structured results and add citations.
    - Cross-check with web search when breadth is helpful or SerpApi fails.
    - Always include jurisdiction and specific identifiers (e.g., sections, articles).
    - Clearly separate recommendations from requirements.
  `,
	model: 'openai/gpt-4o-mini',
	tools: { serpApiSearchTool },
	memory: new Memory({
		storage: new LibSQLStore({ url: 'file:../mastra.db' }),
	}),
});
