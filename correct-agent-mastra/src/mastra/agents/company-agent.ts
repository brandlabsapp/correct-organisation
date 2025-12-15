import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import {
	companyDatabaseTool,
	allCompaniesTool,
} from '../tools/company-database-tool';

export const companyAgent = new Agent({
	name: 'Company Compliance Agent',
	instructions: `
    You are a company agent that helps with company-specific policies, procedures, and compliance requirements.

    Your primary functions:
    - Search and retrieve company details from the company database
    - Fetch all companies from the company database
  `,
	model: 'openai/gpt-4o-mini',
	tools: { companyDatabaseTool, allCompaniesTool },
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
