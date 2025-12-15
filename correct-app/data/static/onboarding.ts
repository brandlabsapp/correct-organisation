export const industries = [
	{ label: 'Agriculture', value: 'agriculture' },
	{ label: 'Automotive', value: 'automotive' },
	{ label: 'Banking & Finance', value: 'banking-finance' },
	{ label: 'Construction', value: 'construction' },
	{ label: 'Consumer Goods', value: 'consumer-goods' },
	{ label: 'Education', value: 'education' },
	{ label: 'Energy', value: 'energy' },
	{ label: 'Healthcare', value: 'healthcare' },
	{ label: 'Hospitality', value: 'hospitality' },
	{ label: 'Information Technology', value: 'information-technology' },
	{ label: 'Manufacturing', value: 'manufacturing' },
	{ label: 'Media & Entertainment', value: 'media-entertainment' },
	{ label: 'NGO', value: 'ngo' },
	{ label: 'Pharmaceuticals', value: 'pharmaceuticals' },
	{ label: 'Real Estate', value: 'real-estate' },
	{ label: 'Retail', value: 'retail' },
	{ label: 'Telecommunications', value: 'telecommunications' },
	{ label: 'Transportation & Logistics', value: 'transportation-logistics' },
	{ label: 'Utilities', value: 'utilities' },
	{ label: 'Legal & Compliance', value: 'legal-compliance' },
	{ label: 'Government & Public Sector', value: 'government-public-sector' },
	{ label: 'Other', value: 'other' },
];

export const businessSizes = ['Micro', 'Small', 'Medium', 'Large'];

export const ownerSelectOptions = [
	{ label: 'Director', value: 'director' },
	{ label: 'CEO', value: 'ceo' },
	{ label: 'Partner', value: 'partner' },
	{ label: 'Operational Head', value: 'operational-head' },
];

export const consultantSelectOptions = [
	{ label: 'Chartered Accountant', value: 'ca' },
	{ label: 'Company Secretary', value: 'cs' },
	{ label: 'Lawyer', value: 'lawyer' },
];

export const ownerRoleToDocumentMap = {
	director: {
		id: 'director-din',
		title: 'Director Identification Number (DIN)',
		type: 'text',
		placeholder: 'Type your DIN',
	},
	ceo: {
		id: 'ceo-letter-of-appointment',
		title: 'Upload letter of appointment',
		type: 'file',
		placeholder: 'Upload letter of appointment',
	},
	partner: {
		id: 'partner-partnership-deed',
		title: 'Upload the Partnership Deed',
		type: 'file',
		placeholder: 'Upload the Partnership Deed',
	},
	'operational-head': {
		id: 'operational-head-authorization-letter',
		title: 'Upload the Authorization letter',
		type: 'file',
		placeholder: 'Upload the Authorization letter',
	},
};

export const consultantRoleToDocumentMap = {
	ca: {
		id: 'ca-membership-number',
		title: 'CA Membership Number',
		type: 'text',
		placeholder: 'Type your CA Membership Number',
	},
	cs: {
		id: 'cs-membership-number',
		title: 'CS Membership Number',
		type: 'text',
		placeholder: 'Type your CS Membership Number',
	},
	lawyer: {
		id: 'lawyer-registration-number',
		title: 'Lawyer Registration Number',
		type: 'text',
		placeholder: 'Type your Lawyer Registration Number',
	},
};

export const roleToDocumentMap = (
	role: string
): Record<string, Onboarding.RoleDocumentMap> => {
	if (role === 'owner') {
		return ownerRoleToDocumentMap;
	}
	return consultantRoleToDocumentMap;
};

export const getSelectOptions = (role: string) => {
	if (role === 'owner') {
		return ownerSelectOptions;
	}
	return consultantSelectOptions;
};
