import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import {
	toolCallAppropriatenessScorer,
	completenessScorer,
	translationScorer,
} from './scorers/weather-scorer';

// Agents per orchestration diagram
import { orchestratorAgent } from './agents/orchestrator-agent';
import { generalAgent } from './agents/general-agent';
import { companyAgent } from './agents/company-agent';
import { complianceAgent } from './agents/compliance-agent';
import { knowledgeAgent } from './agents/knowledge-agent';
import { taskAgent } from './agents/task-agent';
import { webSearchAgent } from './agents/websearch-agent';

// Compliance scorers
import { complianceScorers } from './scorers/compliance-scorers';

export const mastra = new Mastra({
	workflows: { weatherWorkflow },
	agents: {
		orchestratorAgent,
		generalAgent,
		companyAgent,
		complianceAgent,
		knowledgeAgent,
		taskAgent,
		webSearchAgent,
	},
	scorers: {
		toolCallAppropriatenessScorer,
		completenessScorer,
		translationScorer,
		...complianceScorers,
	},
	storage: new LibSQLStore({
		url: ':memory:',
	}),
	logger: new PinoLogger({
		name: 'Mastra',
		level: 'info',
	}),
	telemetry: {
		enabled: true,
	},
	observability: {
		default: { enabled: true },
	},
});
