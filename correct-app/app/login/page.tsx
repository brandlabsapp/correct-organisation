import PhoneAuth from '@/components/custom/auth/PhoneAuth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Login',
	description: 'Phone Authentication',
	keywords: ['login', 'Compliance', 'Compliance Management'],
	icons: '/assets/logo/logo.svg',
};

export default function PhoneAuthPage() {
	return <PhoneAuth />;
}
