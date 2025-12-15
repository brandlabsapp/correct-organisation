import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('orchestratorAgent');
	const result = await agent.generate(
		'What is our internal data retention policy for customer data? Include policy name, version, and last updated date.',
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
