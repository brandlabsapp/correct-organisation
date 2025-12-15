import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('orchestratorAgent');
	const result = await agent.generate(
		"Hi there! What's our company support email? If you know it from internal knowledge, answer directly; otherwise do a quick web search and cite sources.",
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
