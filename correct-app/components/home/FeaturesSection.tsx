import React from 'react';
import {
	ListCheck,
	Clock,
	Lock,
	MessageSquare,
	FileText,
	Bell,
} from 'lucide-react';

const FeaturesSection = () => {
	const features = [
		{
			icon: <ListCheck className='feature-icon' />,
			title: 'Personalized Compliance List',
			description:
				'Get a custom-tailored list of compliances based on your industry, location, and business structure.',
		},
		{
			icon: <Clock className='feature-icon' />,
			title: 'Real-Time Tracker with Alerts',
			description:
				'Never miss deadlines with timely notifications and reminders about upcoming compliance dates.',
		},
		{
			icon: <Lock className='feature-icon' />,
			title: 'Encrypted Vault for Documents',
			description:
				'Store all your compliance documents securely in one place with bank-level encryption.',
		},
		{
			icon: <MessageSquare className='feature-icon' />,
			title: 'AI Assistant for Doubts & Docs',
			description:
				'Ask questions in plain language and get expert guidance on compliance matters instantly.',
		},
		{
			icon: <FileText className='feature-icon' />,
			title: 'Auto-generated Contracts, MOUs',
			description:
				'Generate legally-sound documents with just a few clicks, customized to your requirements.',
		},
		{
			icon: <Bell className='feature-icon' />,
			title: 'Regulatory Change Monitoring',
			description:
				'Stay updated on new regulations affecting your business with real-time alerts and summaries.',
		},
	];

	return (
		<section id='features' className='section-padding bg-white'>
			<div className='container-custom'>
				<div className='text-center mb-16'>
					<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
						What Correct Solves
					</h2>
					<p className='text-mobile-heading3 md:text-heading3 text-deepgrey max-w-3xl mx-auto'>
						Our AI-powered platform simplifies every aspect of business compliance for
						Indian enterprises.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{features.map((feature, index) => (
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
	);
};

export default FeaturesSection;
