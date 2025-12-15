import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';

const PricingSection = () => {
	const features = [
		'All compliance features',
		'Unlimited document storage',
		'AI assistant access',
		'Real-time alerts & notifications',
	];

	return (
		<section id='pricing' className='section-padding bg-white'>
			<div className='container-custom'>
				<div className='md:grid md:grid-cols-2 md:items-center md:gap-12'>
					<div className='text-center md:text-left mb-16 md:mb-0 md:max-w-xl'>
						<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
							Simple, Transparent Pricing
						</h2>
						<p className='text-mobile-heading3 md:text-heading3 text-deepgrey max-w-3xl mx-auto md:mx-0'>
							No hidden fees or complicated tiers. Just one affordable plan.
						</p>
						<p className='mt-6 text-mobile-heading3 md:text-heading3 text-deepgrey'>
							Pay once a year and get everything you need to stay compliant— features,
							storage, alerts and updates included.
						</p>
					</div>

					<div className='w-full md:max-w-xl mx-auto md:mx-0 md:ml-auto'>
						<div className='feature-card text-center p-8 border-gray w-full'>
							<h3 className='text-mobile-heading1 md:text-subheading1 font-bold mb-2'>
								₹6,000/year
							</h3>
							<p className='text-mobile-heading3 md:text-heading3 text-deepgrey mb-6'>
								Flat, all-inclusive
							</p>

							<div className='mb-8'>
								{features.map((feature, index) => (
									<div key={index} className='flex items-center mb-4'>
										<Check className='h-5 w-5 text-primary mr-3' />
										<span className='text-mobile-heading3 md:text-heading3 text-deepgrey'>
											{feature}
										</span>
									</div>
								))}
							</div>

							<Link href='/login'>
								<Button className='btn-primary w-full mb-4'>Start Free Trial</Button>
							</Link>

							<p className='text-sm text-deepgrey'>
								<span className='font-bold'>Free for businesses</span> with turnover
								&lt; ₹6L
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PricingSection;
