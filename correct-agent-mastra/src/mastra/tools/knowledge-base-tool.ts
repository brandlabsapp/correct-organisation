import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

type FactRecord = {
	key: string;
	value: string;
	createdAt: string;
	updatedAt: string;
};

// Very simple in-memory KV store to simulate a knowledge base. In production,
// back this with your database and/or vector store.
const userFactsByNamespace = new Map<string, Map<string, FactRecord>>();

const getNamespace = (namespace: string) => {
	if (!userFactsByNamespace.has(namespace)) {
		userFactsByNamespace.set(namespace, new Map());
	}
	return userFactsByNamespace.get(namespace)!;
};

export const knowledgeBaseTool = createTool({
	id: 'knowledge-base',
	description:
		'Store and retrieve user/company facts. Useful for FAQs, memory, preferences.',
	inputSchema: z.object({
		action: z
			.enum(['remember', 'recall', 'delete', 'list'])
			.describe('Operation to perform on knowledge base'),
		namespace: z
			.string()
			.default('default')
			.describe('Logical namespace e.g. user:<id> | company:<id>'),
		key: z.string().optional().describe('Fact key for remember/recall/delete'),
		value: z.string().optional().describe('Fact value for remember'),
	}),
	outputSchema: z.object({
		ok: z.boolean(),
		result: z.any().optional(),
		message: z.string().optional(),
	}),
	execute: async ({ context }) => {
		const ns = getNamespace(context.namespace);
		const nowIso = new Date().toISOString();

		if (context.action === 'remember') {
			if (!context.key || typeof context.value !== 'string') {
				return { ok: false, message: 'key and value are required for remember' };
			}
			const existing = ns.get(context.key);
			const record: FactRecord = {
				key: context.key,
				value: context.value,
				createdAt: existing?.createdAt || nowIso,
				updatedAt: nowIso,
			};
			ns.set(context.key, record);
			return { ok: true, result: record };
		}

		if (context.action === 'recall') {
			if (!context.key) {
				return { ok: false, message: 'key is required for recall' };
			}
			const record = ns.get(context.key);
			return { ok: true, result: record || null };
		}

		if (context.action === 'delete') {
			if (!context.key) {
				return { ok: false, message: 'key is required for delete' };
			}
			ns.delete(context.key);
			return { ok: true, result: true };
		}

		// list
		return { ok: true, result: Array.from(ns.values()) };
	},
});
