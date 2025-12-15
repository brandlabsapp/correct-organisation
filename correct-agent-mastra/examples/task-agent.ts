import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('taskAgent');
	const result = await agent.generate(
		"Create a task 'Prepare SOC 2 audit docs' due 2025-11-30 owned by Bob; then list tasks.",
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
