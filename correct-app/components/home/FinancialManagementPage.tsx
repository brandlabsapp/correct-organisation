'use client';

import Header from './Header';
import Footer from './Footer';
import {
	FileText,
	Receipt,
	FileCheck,
	Building2,
	TrendingUp,
	Target,
	Banknote,
	RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const FinancialManagementPage = () => {
	const billingFeatures = [
		{
			icon: <FileText className='feature-icon' />,
			title: 'Invoicing',
			description:
				'Create professional invoices quickly with customizable templates. Track payments, send reminders, and manage your billing cycle seamlessly.',
		},
		{
			icon: <Receipt className='feature-icon' />,
			title: 'GST Billing',
			description:
				'Generate GST-compliant invoices with automatic tax calculations. Support for all GST formats and seamless e-way bill generation.',
		},
	];

	const taxComplianceFeatures = [
		{
			icon: <FileCheck className='feature-icon' />,
			title: 'TDS Filing',
			description:
				'Automate TDS calculations and filing. Stay compliant with quarterly TDS returns and generate Form 16/16A effortlessly.',
		},
	];

	const bankingFeatures = [
		{
			icon: <Building2 className='feature-icon' />,
			title: 'Bank Statement Integrations',
			description:
				'Connect your bank accounts securely. Automatically import and categorize transactions from multiple banks in real-time.',
		},
		{
			icon: <RefreshCw className='feature-icon' />,
			title: 'Reconciliation',
			description:
				'Automated bank reconciliation that matches transactions across accounts. Identify discrepancies and maintain accurate financial records.',
		},
	];

	const planningFeatures = [
		{
			icon: <TrendingUp className='feature-icon' />,
			title: 'Financial Forecasting',
			description:
				'AI-powered financial forecasting to predict cash flow, revenue trends, and expenses. Make data-driven decisions with confidence.',
		},
		{
			icon: <Target className='feature-icon' />,
			title: 'Business Planning',
			description:
				'Create comprehensive financial plans and budgets. Set goals, track performance, and adjust strategies based on real-time insights.',
		},
	];

	return (
		<div className='min-h-screen bg-white'>
			<Header />
			<main>
				{/* Hero Section */}
				<section className='section-padding bg-gradient-to-b from-white to-gray-50'>
					<div className='container-custom'>
						<div className='text-center max-w-4xl mx-auto animate-fade-in'>
							<h1 className='text-mobile-heading1 md:text-subheading1 lg:text-[3.5rem] font-bold leading-tight mb-6'>
								Financial Management
								<br />
								<span className='text-green'>Made Simple</span>
							</h1>
							<p className='text-mobile-heading3 md:text-heading3 text-deepgrey mb-8 max-w-2xl mx-auto'>
								Streamline your finances with AI-powered tools for invoicing, tax
								compliance, banking, and strategic planning. Everything you need to
								manage your business finances in one place.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<Link href='/login'>
									<Button className='btn-primary'>Get Started</Button>
								</Link>
								<Link href='/#pricing'>
									<Button variant='outline' className='btn-outline'>
										View Pricing
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* Billing & Invoicing Section */}
				<section className='section-padding bg-white'>
					<div className='container-custom'>
						<div className='text-center mb-16'>
							<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
								Billing & Invoicing
							</h2>
							<p className='text-mobile-heading3 md:text-heading3 text-deepgrey max-w-3xl mx-auto'>
								Create professional invoices and manage billing with ease. Stay
								GST-compliant while saving time.
							</p>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
							{billingFeatures.map((feature, index) => (
								<div
									key={index}
									className='feature-card flex flex-col items-center justify-center text-center'
								>
									{feature.icon}
									<h3 className='text-mobile-heading3 md:text-heading3 font-bold mb-3'>
										{feature.title}
									</h3>
									<p className='text-mobile-heading3 md:text-heading4 text-deepgrey'>
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Tax Compliance Section */}
				<section className='section-padding bg-gray-50'>
					<div className='container-custom'>
						<div className='text-center mb-16'>
							<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
								Tax Compliance
							</h2>
							<p className='text-mobile-heading3 md:text-heading3 text-deepgrey max-w-3xl mx-auto'>
								Automate tax calculations and filings. Stay compliant with Indian tax
								regulations effortlessly.
							</p>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-1 gap-8 max-w-2xl mx-auto'>
							{taxComplianceFeatures.map((feature, index) => (
								<div
									key={index}
									className='feature-card flex flex-col items-center justify-center text-center'
								>
									{feature.icon}
									<h3 className='text-mobile-heading3 md:text-heading3 font-bold mb-3'>
										{feature.title}
									</h3>
									<p className='text-mobile-heading3 md:text-heading4 text-deepgrey'>
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Banking & Reconciliation Section */}
				<section className='section-padding bg-white'>
					<div className='container-custom'>
						<div className='text-center mb-16'>
							<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
								Banking & Reconciliation
							</h2>
							<p className='text-mobile-heading3 md:text-heading3 text-deepgrey max-w-3xl mx-auto'>
								Connect your banks and automate reconciliation. Keep your books
								accurate with minimal effort.
							</p>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
							{bankingFeatures.map((feature, index) => (
								<div
									key={index}
									className='feature-card flex flex-col items-center justify-center text-center'
								>
									{feature.icon}
									<h3 className='text-mobile-heading3 md:text-heading3 font-bold mb-3'>
										{feature.title}
									</h3>
									<p className='text-mobile-heading3 md:text-heading4 text-deepgrey'>
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Planning & Forecasting Section */}
				<section className='section-padding bg-gray-50'>
					<div className='container-custom'>
						<div className='text-center mb-16'>
							<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
								Planning & Forecasting
							</h2>
							<p className='text-mobile-heading3 md:text-heading3 text-deepgrey max-w-3xl mx-auto'>
								Plan for the future with AI-powered insights. Forecast trends and
								create strategic financial plans.
							</p>
						</div>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
							{planningFeatures.map((feature, index) => (
								<div
									key={index}
									className='feature-card flex flex-col items-center justify-center text-center'
								>
									{feature.icon}
									<h3 className='text-mobile-heading3 md:text-heading3 font-bold mb-3'>
										{feature.title}
									</h3>
									<p className='text-mobile-heading3 md:text-heading4 text-deepgrey'>
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className='section-padding bg-white'>
					<div className='container-custom'>
						<div className='text-center max-w-3xl mx-auto bg-gradient-to-r from-green/10 to-blue/10 rounded-2xl p-12'>
							<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
								Ready to Transform Your Financial Management?
							</h2>
							<p className='text-mobile-heading3 md:text-heading3 text-deepgrey mb-8'>
								Join thousands of businesses using Correct to streamline their
								financial operations.
							</p>
							<div className='flex flex-col sm:flex-row gap-4 justify-center'>
								<Link href='/login'>
									<Button className='btn-primary'>Start Free Trial</Button>
								</Link>
								<Link href='/#pricing'>
									<Button variant='outline' className='btn-outline'>
										View Pricing Plans
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default FinancialManagementPage;
