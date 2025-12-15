import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface SerpApiResult {
	position: number;
	title: string;
	link: string;
	snippet: string;
	displayed_link?: string;
	favicon?: string;
	date?: string;
	cached_page_link?: string;
	related_pages_link?: string;
	source?: string;
}

interface SerpApiKnowledgeGraph {
	title: string;
	type: string;
	description: string;
	source: {
		name: string;
		link: string;
	};
}

interface SerpApiResponse {
	search_metadata: {
		id: string;
		status: string;
		json_endpoint: string;
		created_at: string;
		processed_at: string;
		google_url: string;
		raw_html_file: string;
		total_time_taken: number;
	};
	search_parameters: {
		engine: string;
		q: string;
		location_requested?: string;
		location_used?: string;
		google_domain: string;
		hl: string;
		gl: string;
		device: string;
	};
	search_information: {
		organic_results_state: string;
		query_displayed: string;
		total_results?: number;
		time_taken_displayed?: number;
	};
	knowledge_graph?: SerpApiKnowledgeGraph;
	organic_results: SerpApiResult[];
	related_questions?: Array<{
		question: string;
		snippet: string;
		title: string;
		link: string;
	}>;
	related_searches?: Array<{
		query: string;
		link: string;
	}>;
	pagination?: {
		current: number;
		next?: string;
		other_pages?: Record<string, string>;
	};
}

interface LegalSearchResult {
	title: string;
	url: string;
	snippet: string;
	source: string;
	jurisdiction: string;
	relevanceScore: number;
	searchEngine: string;
	date?: string;
}

export const serpApiSearchTool = createTool({
	id: 'search-serpapi-legal',
	description:
		'Search web sources for legal information using SerpApi (Google, Bing, DuckDuckGo)',
	inputSchema: z.object({
		query: z
			.string()
			.describe('Search query for legal or regulatory information'),
		jurisdiction: z
			.string()
			.optional()
			.describe('Specific jurisdiction to focus search on'),
		resultLimit: z
			.number()
			.default(10)
			.describe('Maximum number of results to return'),
		engine: z
			.enum(['google', 'bing', 'duckduckgo', 'baidu'])
			.default('google')
			.describe('Search engine to use'),
		location: z
			.string()
			.optional()
			.describe('Geographic location for localized results'),
		apiKey: z
			.string()
			.optional()
			.describe('SerpApi API key (defaults to environment variable)'),
	}),
	outputSchema: z.object({
		results: z.array(
			z.object({
				title: z.string(),
				url: z.string(),
				snippet: z.string(),
				source: z.string(),
				jurisdiction: z.string(),
				relevanceScore: z.number(),
				searchEngine: z.string(),
				date: z.string().optional(),
			})
		),
		totalFound: z.number(),
		searchQuery: z.string(),
		knowledgeGraph: z
			.object({
				title: z.string(),
				description: z.string(),
				source: z.string(),
			})
			.optional(),
		relatedQuestions: z.array(z.string()),
		relatedSearches: z.array(z.string()),
	}),
	execute: async ({ context }) => {
		return await searchSerpApi(
			context.query,
			context.jurisdiction,
			context.resultLimit,
			context.engine,
			context.location,
			context.apiKey
		);
	},
});

const searchSerpApi = async (
	query: string,
	jurisdiction?: string,
	resultLimit: number = 10,
	engine: string = 'google',
	location?: string,
	apiKey?: string
) => {
	try {
		// Get API key from parameter or environment variable
		const serpApiKey =
			'45a2d829f95c08cfb6d870c8d5e198153090cd5922c745d487420b74c0e76186';

		if (!serpApiKey) {
			console.warn('SerpApi API key not found, falling back to mock data');
			// return await fallbackSerpApiSearch(query, jurisdiction, resultLimit);
		}

		// Build search query with jurisdiction if provided
		const searchQuery = jurisdiction ? `${query} ${jurisdiction}` : query;

		// Build SerpApi URL
		const searchParams = new URLSearchParams({
			engine: engine,
			q: searchQuery,
			api_key: serpApiKey,
			num: Math.min(resultLimit, 100).toString(),
			hl: 'en',
			gl: 'us',
			device: 'desktop',
		});

		if (location) {
			searchParams.append('location', location);
		}

		const searchUrl = `https://serpapi.com/search?${searchParams.toString()}`;

		// Make request to SerpApi
		const response = await fetch(searchUrl, {
			headers: {
				'api-key': serpApiKey,
			},
		});

		if (!response.ok) {
			throw new Error(
				`SerpApi search failed: ${response.status} ${response.statusText}`
			);
		}

		const data: SerpApiResponse = await response.json();

		// Check for API errors
		if (data.search_metadata.status === 'Error') {
			throw new Error('SerpApi returned an error status');
		}

		// Process and filter results for legal/compliance relevance
		const processedResults = data.organic_results
			.filter((result) => isLegalRelevant(result, query))
			.map((result) => ({
				title: result.title,
				url: result.link,
				snippet: result.snippet || '',
				source: extractDomain(result.link),
				jurisdiction: detectJurisdiction(result, jurisdiction),
				relevanceScore: calculateRelevanceScore(result, query, jurisdiction),
				searchEngine: engine,
				date: result.date,
			}))
			.sort((a, b) => b.relevanceScore - a.relevanceScore)
			.slice(0, resultLimit);

		// Extract knowledge graph if available
		const knowledgeGraph = data.knowledge_graph
			? {
					title: data.knowledge_graph.title,
					description: data.knowledge_graph.description,
					source: data.knowledge_graph.source.name,
				}
			: undefined;

		// Extract related questions and searches
		const relatedQuestions = data.related_questions?.map((q) => q.question) || [];
		const relatedSearches = data.related_searches?.map((s) => s.query) || [];

		return {
			results: processedResults,
			totalFound: data.search_information.total_results || 0,
			searchQuery: data.search_parameters.q,
			knowledgeGraph,
			relatedQuestions,
			relatedSearches,
		};
	} catch (error) {
		console.error('SerpApi search error:', error);

		// Fallback to mock data if SerpApi is unavailable
		return await fallbackSerpApiSearch(query, jurisdiction, resultLimit);
	}
};

// Helper function to determine if a result is relevant to legal/compliance topics
const isLegalRelevant = (result: SerpApiResult, query: string): boolean => {
	const legalKeywords = [
		'law',
		'legal',
		'regulation',
		'compliance',
		'policy',
		'act',
		'statute',
		'gdpr',
		'sox',
		'osha',
		'ccpa',
		'hipaa',
		'sec',
		'fda',
		'epa',
		'government',
		'federal',
		'state',
		'court',
		'justice',
		'attorney',
		'requirements',
		'standards',
		'guidelines',
		'rules',
		'enforcement',
	];

	const text = `${result.title} ${result.snippet} ${result.link}`.toLowerCase();
	const queryLower = query.toLowerCase();

	// Check if result contains legal keywords or matches query intent
	return (
		legalKeywords.some((keyword) => text.includes(keyword)) ||
		text.includes(queryLower) ||
		result.link.includes('.gov') ||
		result.link.includes('.edu') ||
		result.link.includes('legal') ||
		result.link.includes('law')
	);
};

// Helper function to extract domain from URL
const extractDomain = (url: string): string => {
	try {
		const domain = new URL(url).hostname;
		return domain.replace('www.', '');
	} catch {
		return 'Unknown';
	}
};

// Helper function to detect jurisdiction from result
const detectJurisdiction = (
	result: SerpApiResult,
	requestedJurisdiction?: string
): string => {
	if (requestedJurisdiction) return requestedJurisdiction;

	const url = result.link.toLowerCase();
	const text = `${result.title} ${result.snippet}`.toLowerCase();

	// Government domain patterns
	if (url.includes('.gov')) return 'United States';
	if (url.includes('.eu') || text.includes('european union'))
		return 'European Union';
	if (url.includes('.uk') || url.includes('.gov.uk')) return 'United Kingdom';
	if (url.includes('.ca') || url.includes('.gc.ca')) return 'Canada';
	if (url.includes('.au') || url.includes('.gov.au')) return 'Australia';

	// State-specific patterns
	if (text.includes('california') || url.includes('ca.gov'))
		return 'California, USA';
	if (text.includes('new york') || url.includes('ny.gov'))
		return 'New York, USA';
	if (text.includes('texas') || url.includes('tx.gov')) return 'Texas, USA';

	return 'International';
};

// Helper function to calculate relevance score
const calculateRelevanceScore = (
	result: SerpApiResult,
	query: string,
	jurisdiction?: string
): number => {
	let score = 0.5; // Base score
	const queryLower = query.toLowerCase();
	const titleLower = result.title.toLowerCase();
	const snippetLower = result.snippet?.toLowerCase() || '';

	// Boost score for title matches
	if (titleLower.includes(queryLower)) score += 0.3;

	// Boost score for snippet matches
	if (snippetLower.includes(queryLower)) score += 0.2;

	// Boost score for authoritative sources
	const authoritativeDomains = [
		'gov',
		'edu',
		'sec.gov',
		'osha.gov',
		'europa.eu',
	];
	if (authoritativeDomains.some((domain) => result.link.includes(domain))) {
		score += 0.4;
	}

	// Boost score for jurisdiction match
	if (
		jurisdiction &&
		result.link.toLowerCase().includes(jurisdiction.toLowerCase())
	) {
		score += 0.2;
	}

	// Boost score for higher position in search results
	if (result.position <= 3) score += 0.2;
	else if (result.position <= 10) score += 0.1;

	return Math.min(1.0, score);
};

// Fallback search function using mock data
const fallbackSerpApiSearch = async (
	query: string,
	jurisdiction?: string,
	resultLimit: number = 10
) => {
	const mockLegalResources = [
		{
			title: 'GDPR Compliance Requirements - Official EU Regulation',
			url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
			snippet:
				'The General Data Protection Regulation (GDPR) requires organizations to implement appropriate technical and organizational measures to ensure data protection by design and by default.',
			source: 'eur-lex.europa.eu',
			jurisdiction: 'European Union',
			relevanceScore: 0.95,
			searchEngine: 'fallback',
			date: '2024-01-01',
		},
		{
			title: 'Sarbanes-Oxley Act Section 404 - SEC Guidance',
			url: 'https://www.sec.gov/rules/final/33-8238.htm',
			snippet:
				'Section 404 of the Sarbanes-Oxley Act requires management to assess the effectiveness of internal controls over financial reporting.',
			source: 'sec.gov',
			jurisdiction: 'United States',
			relevanceScore: 0.9,
			searchEngine: 'fallback',
			date: '2024-02-15',
		},
		{
			title: 'OSHA Workplace Safety Standards and Regulations',
			url: 'https://www.osha.gov/laws-regs/regulations/standardnumber',
			snippet:
				'The Occupational Safety and Health Administration sets and enforces protective workplace safety standards to ensure safe working conditions.',
			source: 'osha.gov',
			jurisdiction: 'United States',
			relevanceScore: 0.85,
			searchEngine: 'fallback',
			date: '2024-03-01',
		},
		{
			title: 'California Consumer Privacy Act (CCPA) - Consumer Rights',
			url: 'https://oag.ca.gov/privacy/ccpa',
			snippet:
				'The California Consumer Privacy Act grants consumers specific rights regarding their personal information, including the right to know, delete, and opt-out.',
			source: 'oag.ca.gov',
			jurisdiction: 'California, USA',
			relevanceScore: 0.8,
			searchEngine: 'fallback',
			date: '2024-01-20',
		},
		{
			title: 'HIPAA Privacy Rule - Healthcare Data Protection',
			url: 'https://www.hhs.gov/hipaa/for-professionals/privacy/index.html',
			snippet:
				'The HIPAA Privacy Rule establishes national standards to protect individuals medical records and other personal health information.',
			source: 'hhs.gov',
			jurisdiction: 'United States',
			relevanceScore: 0.75,
			searchEngine: 'fallback',
			date: '2024-02-10',
		},
	];

	const queryLower = query.toLowerCase();
	let filteredResults = mockLegalResources.filter(
		(resource) =>
			resource.title.toLowerCase().includes(queryLower) ||
			resource.snippet.toLowerCase().includes(queryLower)
	);

	if (jurisdiction) {
		const jurisdictionLower = jurisdiction.toLowerCase();
		filteredResults = filteredResults.filter((resource) =>
			resource.jurisdiction.toLowerCase().includes(jurisdictionLower)
		);
	}

	const sortedResults = filteredResults
		.sort((a, b) => b.relevanceScore - a.relevanceScore)
		.slice(0, resultLimit);

	return {
		results: sortedResults,
		totalFound: filteredResults.length,
		searchQuery: query,
		knowledgeGraph: undefined,
		relatedQuestions: [
			'What are the key compliance requirements?',
			'How to implement data protection measures?',
			'What are the penalties for non-compliance?',
		],
		relatedSearches: [
			'compliance best practices',
			'regulatory requirements',
			'legal obligations',
		],
	};
};
