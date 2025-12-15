import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('orchestratorAgent');
	const result = await agent.generate(
		"Create a compliance task titled 'Update privacy policy' due 2025-12-01 owned by Alice; then list all tasks.",
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
