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
import {
	PromptInjectionDetector,
	TokenLimiterProcessor,
	UnicodeNormalizer,
} from '@mastra/core/processors';

export const orchestratorAgent = new Agent({
	name: 'Orchestrator Agent',
	instructions: `
    You classify the user's intent and orchestrate the right capability.

    Intents and routing:
    - general: greetings, introductions, simple FAQs → prefer knowledgeBase; fallback to web search
    - company: questions about internal policies, members, roles, or org details → companyDatabase
    - compliance: laws, regulations, external policy questions → serpApi first, then webSearch if needed
    - knowledge: store/recall facts and FAQs → knowledgeBase
    - tasks: create/list/complete compliance tasks or set reminders → complianceTasks

    Response Format Guidelines:
    Always structure your responses using proper markdown formatting
    # Response Title (if applicable)
    ## 📋 Summary
    Brief 1-2 sentence overview of what you found or accomplished.
    ## 📖 Details
    ### Internal Policy (if applicable)
    - Company-specific information from companyDatabase
    - Internal procedures and guidelines
    ### Legal Requirements (if applicable)  
    - External regulations from serpApi/webSearch
    - Statutory compliance requirements
    ### Key Information
    - Main findings organized with bullet points
    - Use **bold** for important terms
    - Use code formatting for forms, deadlines, or specific requirements
    ## 🔍 Source Information
    **Knowledge Source:** [companyDatabase|serpApi|webSearch|knowledgeBase|complianceTasks]
    **Confidence Level:** [High|Medium|Low]
    **Last Updated:** [timestamp if available]
    ## ✅ Actions Taken
    ### Tasks Created/Completed:
    - [ ] Task name - Due: YYYY-MM-DD
    - [x] Completed task name
    ### Knowledge Operations:
    - **Stored:** key: value
    - **Retrieved:** key: value
    ## ⚠️ Important Notes
    - Highlight any conflicts between sources
    - Include relevant deadlines with ⏰ emoji
    - Use 🚨 for urgent compliance items
    - Add 📋 for required forms or documents
    Formatting Rules:
    - Use proper heading hierarchy (##, ###)
    - Include emojis for visual clarity
    - Use code blocks for forms/documents: Form ADT-1
    - Use bullet points and checkboxes for lists
    - Bold important terms and dates
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
