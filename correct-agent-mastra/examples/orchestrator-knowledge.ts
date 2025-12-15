import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('orchestratorAgent');
	const result = await agent.generate(
		"Store key 'office:hours' with value 'Mon–Fri 9am–5pm', then recall 'office:hours'.",
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
