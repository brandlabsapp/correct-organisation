import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('orchestratorAgent');
	const result = await agent.generate(
		'Summarize GDPR Article 5 principles with citations to official sources and include the jurisdiction.',
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
