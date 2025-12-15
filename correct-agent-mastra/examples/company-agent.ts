import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('companyAgent');
	const result = await agent.generate(
		'List responsible departments for SOC 2 compliance and any pending company items with due dates.',
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
