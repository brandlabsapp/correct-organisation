import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { companyDatabaseTool } from '../tools/company-database-tool';
import { serpApiSearchTool } from '../tools/serpapi-search-tool';
import { knowledgeBaseTool } from '../tools/knowledge-base-tool';
import { complianceTasksTool } from '../tools/compliance-tasks-tool';

// Sub-agents available for delegation
import { generalAgent } from './general-agent';
import { companyAgent } from './company-agent';
import { complianceAgent } from './compliance-agent';
import { knowledgeAgent } from './knowledge-agent';
import { taskAgent } from './task-agent';
import { webSearchAgent } from './websearch-agent';

// Scorers
import {
	createAnswerRelevancyScorer,
	createHallucinationScorer,
	createContextPrecisionScorer,
	createContextRelevanceScorer,
} from '@mastra/evals/scorers/llm';

// Processors
import {
	PromptInjectionDetector,
	TokenLimiterProcessor,
	UnicodeNormalizer,
} from '@mastra/core/processors';

export const orchestratorAgent = new Agent({
	name: 'Orchestrator Agent',
	instructions: `
You are a Compliance Assistant that helps users with regulatory questions, company policies, and compliance-related tasks.

## Your Role
Analyze user queries and route them to the appropriate capability:

**Query Types & Routing:**
- **Greetings/General**: Respond warmly, offer assistance with compliance topics
- **Company Questions**: Internal policies, team members, org structure → use companyDatabase
- **Regulatory/Legal**: Laws, regulations, statutory requirements → use serpApi for authoritative sources
- **Knowledge Management**: Store or recall facts, FAQs, preferences → use knowledgeBase  
- **Task Management**: Create, list, or complete compliance tasks/reminders → use complianceTasks

## Response Guidelines
- Be conversational and helpful, not robotic
- Use clear language that non-experts can understand
- When citing regulations or deadlines, be specific with names and dates
- For complex topics, break down information into digestible points
- If unsure about something, acknowledge uncertainty and suggest verification
- Always prioritize accuracy for compliance-related information

## Formatting
- Use markdown for readability when helpful (bullets, bold for emphasis)
- Keep responses focused and concise.
- Highlight important deadlines, forms, or action items when relevant.
- For regulatory information, mention the source when possible

  `,
	model: 'openai/gpt-4o',
	agents: {
		generalAgent,
		companyAgent,
		complianceAgent,
		knowledgeAgent,
		taskAgent,
		webSearchAgent,
	},
	inputProcessors: [
		new UnicodeNormalizer({
			stripControlChars: true,
			collapseWhitespace: true,
		}),
		new PromptInjectionDetector({
			model: openai('gpt-4.1-nano'),
			threshold: 0.8,
			strategy: 'rewrite',
			detectionTypes: ['injection', 'jailbreak', 'system-override'],
		}),
	],
	outputProcessors: [
		new TokenLimiterProcessor({
			limit: 1000,
			strategy: 'truncate',
			countMode: 'cumulative',
		}),
	],
	scorers: {
		relevancy: {
			scorer: createAnswerRelevancyScorer({
				model: 'openai/gpt-4o-mini',
			}),
			sampling: { type: 'ratio', rate: 0.9 },
		},
		hallucination: {
			scorer: createHallucinationScorer({
				model: 'openai/gpt-4o-mini',
			}),
			sampling: { type: 'ratio', rate: 0.9 },
		},
	},
	tools: {
		companyDatabaseTool,
		serpApiSearchTool,
		knowledgeBaseTool,
		complianceTasksTool,
	},
	memory: new Memory({
		storage: new LibSQLStore({
			url: 'file:../mastra.db',
		}),
	}),
});
