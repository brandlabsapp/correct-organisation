import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { ClientComponentWrapper } from '@/components/common/ClientComponentWrapper';
import { AuthLayoutWrapper } from '@/components/common/AuthLayoutWrapper';
import Clarity from '@/metrics/Clarity';
import { GoogleAnalytics } from '@next/third-parties/google';
import { EventsProvider } from '@/contexts/event';

export const metadata = {
	metadataBase: new URL('https://www.correctapp.ai'),
	title: 'Correct - Simplify Compliance Management',
	description: 'AI-powered compliance management platform for Indian businesses',
	keywords: ['Correct', 'Compliance', 'Compliance Management'],
	icons: '/assets/logo/logo.svg',
	openGraph: {
		title: 'Correct - Simplify Compliance Management',
		description:
			'AI-powered compliance management platform for Indian businesses',
		images: '/assets/logo/logo.svg',
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' className='font-nicky-sans'>
			<head>
				<link rel='icon' href='/assets/logo/logo.svg' />
			</head>
			<Clarity />
			<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!} />
			<body>
				<ClientComponentWrapper fallback={<LoadingFallback />}>
					<ThemeProvider attribute='class'>
						<EventsProvider>
							<AuthLayoutWrapper>{children}</AuthLayoutWrapper>
						</EventsProvider>
					</ThemeProvider>
				</ClientComponentWrapper>
			</body>
		</html>
	);
}
