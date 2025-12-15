import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('generalAgent');
	const result = await agent.generate(
		"What's our refund policy? If unknown internally, do a brief web search and cite.",
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
