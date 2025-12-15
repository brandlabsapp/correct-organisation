import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('webSearchAgent');
	const result = await agent.generate(
		'Find latest SEC 10-K filing requirements and cite authoritative sources.',
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
