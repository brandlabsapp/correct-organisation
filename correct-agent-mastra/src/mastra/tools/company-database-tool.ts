import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const backendURL =
	process.env.BACKEND_SERVICE_URL || 'http://localhost:8000/api/v1';

export const fetchAllCompanies = async (userId: number) => {
	const response = await fetch(`${backendURL}/mastra/fetch-all-companies-of-user/${userId}`);
	if (!response.ok) {
		throw new Error('Failed to fetch all companies');
	}
	const data = await response.json();
	return data;
};

const searchCompanyDatabase = async (companyId: number) => {
	const response = await fetch(
		`${backendURL}/mastra/fetch-company-details/${companyId}`
	);
	if (!response.ok) {
		throw new Error('Failed to search company database');
	}
	const data = await response.json();
	return data;
};

export const companyDatabaseTool = createTool({
	id: 'search-company-database',
	description: 'Search company in db by company id',
	inputSchema: z.object({
		companyId: z.number().describe('Company ID'),
	}),
	outputSchema: z.object({
		company: z.any(),
	}),
	execute: async ({ context,runtimeContext }) => {
		const companyId = runtimeContext.get('companyId');	
		console.log('companyId', companyId);
		const parsedCompanyId = parseInt(companyId as string);
		const company = await searchCompanyDatabase(parsedCompanyId);
		return company 
	},
});

export const allCompaniesTool =  createTool({
	id: 'fetch-all-companies',
	description: 'Fetch all companies from db by user id',
	execute: async ({ runtimeContext }) => {
		const userId = runtimeContext.get('userId');
		const companies = await fetchAllCompanies(10);
		return companies;
	},
});
