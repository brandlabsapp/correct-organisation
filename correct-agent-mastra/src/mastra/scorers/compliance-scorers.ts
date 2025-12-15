import { z } from 'zod';
import { createToolCallAccuracyScorerCode } from '@mastra/evals/scorers/code';
import { createCompletenessScorer } from '@mastra/evals/scorers/code';
import { createScorer } from '@mastra/core/scores';

export const companyDatabaseToolScorer = createToolCallAccuracyScorerCode({
	expectedTool: 'companyDatabaseTool',
	strictMode: false,
});

export const webSearchToolScorer = createToolCallAccuracyScorerCode({
	expectedTool: 'webSearchTool',
	strictMode: false,
});

export const complianceCompletenessScorer = createCompletenessScorer();

// Custom scorer: evaluates if compliance responses include proper citations
export const citationQualityScorer = createScorer({
	name: 'Citation Quality',
	description:
		'Checks that compliance responses include proper source citations and references',
	type: 'agent',
	judge: {
		model: 'openai/gpt-4o-mini',
		instructions:
			'You are an expert evaluator of compliance documentation quality. ' +
			'Determine whether the assistant response includes proper citations, source references, ' +
			'and specific policy/regulation identifiers. ' +
			'Return only the structured JSON matching the provided schema.',
	},
})
	.preprocess(({ run }) => {
		const userText = (run.input?.inputMessages?.[0]?.content as string) || '';
		const assistantText = (run.output?.[0]?.content as string) || '';
		return { userText, assistantText };
	})
	.analyze({
		description: 'Extract and evaluate citation quality in compliance responses',
		outputSchema: z.object({
			hasCitations: z.boolean(),
			hasSourceReferences: z.boolean(),
			hasPolicyNumbers: z.boolean(),
			hasJurisdiction: z.boolean(),
			confidence: z.number().min(0).max(1).default(1),
			explanation: z.string().default(''),
		}),
		createPrompt: ({ results }) => `
      You are evaluating the citation quality of a compliance response.
      User query:
      """
      ${results.preprocessStepResult.userText}
      """
      Assistant response:
      """
      ${results.preprocessStepResult.assistantText}
      """
      
      Evaluate if the response includes:
      1) Proper citations to regulations, laws, or policies
      2) Source references (e.g., SEC.gov, company policy documents)
      3) Specific policy or regulation numbers/identifiers
      4) Jurisdiction information where applicable
      
      Return JSON with fields:
      {
        "hasCitations": boolean,
        "hasSourceReferences": boolean,
        "hasPolicyNumbers": boolean,
        "hasJurisdiction": boolean,
        "confidence": number, // 0-1
        "explanation": string
      }
    `,
	})
	.generateScore(({ results }) => {
		const r = (results as any)?.analyzeStepResult || {};
		let score = 0;

		if (r.hasCitations) score += 0.3;
		if (r.hasSourceReferences) score += 0.3;
		if (r.hasPolicyNumbers) score += 0.2;
		if (r.hasJurisdiction) score += 0.2;

		// Apply confidence weighting
		score = score * (r.confidence ?? 1);

		return Math.max(0, Math.min(1, score));
	})
	.generateReason(({ results, score }) => {
		const r = (results as any)?.analyzeStepResult || {};
		return `Citation quality: citations=${r.hasCitations ?? false}, sources=${r.hasSourceReferences ?? false}, policy_numbers=${r.hasPolicyNumbers ?? false}, jurisdiction=${r.hasJurisdiction ?? false}. Score=${score}. ${r.explanation ?? ''}`;
	});

// Custom scorer: evaluates if responses properly distinguish between company policy and external law
export const policyLawDistinctionScorer = createScorer({
	name: 'Policy vs Law Distinction',
	description:
		'Checks that responses clearly distinguish between company policies and external legal requirements',
	type: 'agent',
	judge: {
		model: 'openai/gpt-4o-mini',
		instructions:
			'You are an expert evaluator of compliance communication clarity. ' +
			'Determine whether the assistant clearly distinguishes between internal company policies ' +
			'and external legal/regulatory requirements. ' +
			'Return only the structured JSON matching the provided schema.',
	},
})
	.preprocess(({ run }) => {
		const userText = (run.input?.inputMessages?.[0]?.content as string) || '';
		const assistantText = (run.output?.[0]?.content as string) || '';
		return { userText, assistantText };
	})
	.analyze({
		description:
			'Evaluate clarity of distinction between company policy and external law',
		outputSchema: z.object({
			mentionsBoth: z.boolean(),
			clearlyDistinguishes: z.boolean(),
			usesAppropriateLabels: z.boolean(),
			confidence: z.number().min(0).max(1).default(1),
			explanation: z.string().default(''),
		}),
		createPrompt: ({ results }) => `
      You are evaluating whether a compliance response clearly distinguishes between company policies and external legal requirements.
      User query:
      """
      ${results.preprocessStepResult.userText}
      """
      Assistant response:
      """
      ${results.preprocessStepResult.assistantText}
      """
      
      Evaluate if the response:
      1) Mentions both company policies and external legal requirements (if both are relevant)
      2) Clearly distinguishes between internal policies and external laws
      3) Uses appropriate labels (e.g., "company policy", "legal requirement", "regulation")
      
      Return JSON with fields:
      {
        "mentionsBoth": boolean,
        "clearlyDistinguishes": boolean,
        "usesAppropriateLabels": boolean,
        "confidence": number, // 0-1
        "explanation": string
      }
    `,
	})
	.generateScore(({ results }) => {
		const r = (results as any)?.analyzeStepResult || {};
		let score = 0;

		if (r.mentionsBoth) score += 0.3;
		if (r.clearlyDistinguishes) score += 0.4;
		if (r.usesAppropriateLabels) score += 0.3;

		// Apply confidence weighting
		score = score * (r.confidence ?? 1);

		return Math.max(0, Math.min(1, score));
	})
	.generateReason(({ results, score }) => {
		const r = (results as any)?.analyzeStepResult || {};
		return `Policy/Law distinction: mentions_both=${r.mentionsBoth ?? false}, clearly_distinguishes=${r.clearlyDistinguishes ?? false}, appropriate_labels=${r.usesAppropriateLabels ?? false}. Score=${score}. ${r.explanation ?? ''}`;
	});

export const complianceScorers = {
	companyDatabaseToolScorer,
	webSearchToolScorer,
	complianceCompletenessScorer,
	citationQualityScorer,
	policyLawDistinctionScorer,
};
