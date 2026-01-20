const MAX_RESEND_ATTEMPTS = 3;
const COUNTDOWN_INITIAL = 30;
const COUNTRY_CODE = '+91';

export { MAX_RESEND_ATTEMPTS, COUNTDOWN_INITIAL, COUNTRY_CODE };

export const requiredHeaders = [
	'title',
	'state',
	'category',
	'applicability',
	'purpose',
	'duedaterule',
	'penalties',
	'section',
];

export const templateData = [
	{
		title: 'Sample Compliance Form',
		state: 'India',
		category: 'Company Law',
		applicability: 'Private Limited Companies',
		purpose: 'Sample purpose for compliance',
		dueDateRule: 'Within 30 days',
		penalties: 'Sample penalty description',
		section: 'Section 123',
		rules: 'Rule 1',
		startDate: '2024-01-01',
		endDate: '2024-12-31',
	},
	{
		title: 'Another Sample Form',
		state: 'Maharashtra',
		category: 'Tax Law',
		applicability: 'All Companies',
		purpose: 'Another sample purpose',
		dueDateRule: 'Within 15 days',
		penalties: 'Another penalty description',
		section: 'Section 456',
		rules: 'Rule 2',
		startDate: '2024-01-01',
		endDate: '2024-12-31',
	},
];

export const allowedRoutes = ['/', '/auth', '/admin', '/correct', '/ai-chat', '/login'];
