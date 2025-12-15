import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('weatherAgent');
	const result = await agent.generate("What's the weather in New York today?", {
		format: 'aisdk',
	});
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
