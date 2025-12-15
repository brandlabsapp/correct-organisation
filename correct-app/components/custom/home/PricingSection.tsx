import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

type Props = {
	pricingInfo: home.IPricing[];
};

const PricingSection = ({ pricingInfo }: Props) => {
	return (
		<div>
			<section id='pricing' className='py-12 md:py-24 lg:py-32 bg-gray-100'>
				<div className='container px-4 md:px-6'>
					<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12'>
						Pricing Plans
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{pricingInfo.map((plan, index) => (
							<Card key={index} className={index === 1 ? 'border-primary' : ''}>
								<CardContent className='p-6'>
									<h3 className='font-bold text-2xl mb-2'>{plan.name}</h3>
									<p className='text-3xl font-bold mb-4'>
										{plan.price}
										<span className='text-sm font-normal'>/month</span>
									</p>
									<ul className='space-y-2 mb-4'>
										{plan.features.map((feature, featureIndex) => (
											<li key={featureIndex} className='flex items-center'>
												<svg
													className='w-4 h-4 mr-2 text-green-500'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth='2'
														d='M5 13l4 4L19 7'
													></path>
												</svg>
												{feature}
											</li>
										))}
									</ul>
									<Button
										className='w-full'
										variant={index === 1 ? 'default' : 'outline'}
									>
										Choose Plan
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default PricingSection;
