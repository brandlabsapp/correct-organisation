import { Section } from '@/components/checklist/section';
import BusinessRegistrationForm from '../_components/BusinessRegistrationForm';
import type { Metadata } from 'next';

// ------------ Metadata ------------

export const metadata: Metadata = {
	title: 'Business Registration',
	description: 'Business Registration',
	keywords: [
		'Business Registration',
		'Compliance',
		'Compliance Management',
		'Compliance Tracker',
	],
};

export default function BusinessRegistrationPage() {
	return (
		<div className='bg-white'>
			<BusinessRegistrationForm />
		</div>
	);
}
