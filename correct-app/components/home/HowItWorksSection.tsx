import React from 'react';

const HowItWorksSection = () => {
	const steps = [
		{
			number: 1,
			title: 'Share business details',
			description:
				'Tell us about your business structure, location, and industry.',
		},
		{
			number: 2,
			title: 'Get compliance roadmap',
			description: 'Receive a personalized plan with deadlines and requirements.',
		},
		{
			number: 3,
			title: 'Stay secure and updated',
			description: 'Get notifications and never miss a compliance deadline again.',
		},
	];

	return (
		<section id='how-it-works' className='bg-white section-padding'>
			<div className='container-custom'>
				<div className='text-center mb-16'>
					<h2 className='text-heading2 md:text-subheading1 font-bold mb-4'>
						How It Works
					</h2>
					<p className='text-xl text-deepgrey max-w-3xl mx-auto'>
						Getting started with Correct is quick and easy.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
					{steps.map((step, index) => (
						<div key={index} className='feature-card relative'>
							<div className='absolute -top-4 -left-4 bg-lightgray  h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold'>
								{step.number}
							</div>
							<div className='mt-6 text-center md:text-left'>
								<h3 className='text-mobile-heading3 md:text-heading3 font-bold mb-4'>
									{step.title}
								</h3>
								<p className='text-mobile-heading3 md:text-heading4 text-deepgrey'>
									{step.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default HowItWorksSection;
