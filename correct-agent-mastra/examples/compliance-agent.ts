import { mastra } from '../src/mastra/index';

async function main() {
	const agent = mastra.getAgent('complianceAgent');
	const result = await agent.generate(
		'What are the HIPAA Privacy Rule key requirements? Provide citations and specify the jurisdiction.',
		{ format: 'aisdk' }
	);
	console.log(result.text);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
