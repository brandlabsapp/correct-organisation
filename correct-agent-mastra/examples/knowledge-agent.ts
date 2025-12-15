import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('knowledgeAgent');
	const result = await agent.generate(
		"Store key 'faq:refund_policy' with value '30 days from purchase'. Then recall 'faq:refund_policy'.",
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
