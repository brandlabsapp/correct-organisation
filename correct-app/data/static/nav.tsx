interface NavItem {
	href: string;
	label: string;
	icon?: React.ReactNode;
}

export const navItems: NavItem[] = [
	{ href: 'features', label: 'Features' },
	{ href: 'pricing', label: 'Pricing' },
	{ href: 'testimonials', label: 'Testimonials' },
];

export const authNavItems = [
	{
		href: 'dashboard',
		label: 'Dashboard',
	},
	{
		href: 'checklist',
		label: 'Checklist',
	},
	{
		href: 'settings',
		label: 'Settings',
	},
];
