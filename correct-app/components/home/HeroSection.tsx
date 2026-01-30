import React from 'react';
import Image from 'next/image';
import HeroChatInput from './HeroChatInput';

const HeroSection = () => {
	return (
		<section className='section-padding'>
			<div className='container-custom'>
				{/* Hero Content - Centered */}
				<div className='text-center max-w-4xl mx-auto animate-fade-in'>
					<h1 className='text-mobile-heading1 md:text-subheading1 lg:text-[3.5rem] font-bold leading-tight mb-6'>
						Simplify Compliance. <br />
						<span className='text-green'>Amplify Growth.</span>
					</h1>
					<p className='text-mobile-heading3 md:text-heading3 text-deepgrey mb-8 max-w-2xl mx-auto'>
						AI-powered compliance automation for Indian businesses. Navigate 69,000+
						rules with confidence.
					</p>

					{/* Chat Input - The new hero CTA */}
					<HeroChatInput />
				</div>

				{/* Dashboard Preview Image */}
				<div
					className='mt-16 animate-fade-in max-w-5xl mx-auto'
					style={{ animationDelay: '0.3s' }}
				>
					<div className='rounded-2xl shadow-card overflow-hidden border border-gray-100'>
						<Image
							src='https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80'
							alt='Correct Dashboard'
							width={1374}
							height={800}
							className='w-full h-auto'
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;

