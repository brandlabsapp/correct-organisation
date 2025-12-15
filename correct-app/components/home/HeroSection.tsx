import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
	return (
		<section className='section-padding'>
			<div className='container-custom'>
				<div className='flex flex-col md:flex-row items-center'>
					<div className='md:w-1/2 mb-10 md:mb-0 md:pr-8 animate-fade-in order-2 md:order-1'>
						<h2 className='text-mobile-heading1 md:text-subheading1 font-bold leading-tight mb-6 mt-5'>
							Simplify Compliance. <br />
							<span>Amplify Growth.</span>
						</h2>
						<p className='text-mobile-heading3 md:text-heading3 text-deepgrey mb-8'>
							AI-powered compliance automation for Indian businesses. Navigate 69,000+
							rules with confidence.
						</p>
						<div className='flex items-center flex-col sm:flex-row gap-4'>
							<Link href='/ai-chat'>
								<Button className='btn-primary flex items-center gap-2'>
									Get Started Free <ArrowRight size={16} />
								</Button>
							</Link>
						</div>
					</div>

					<div
						className='md:w-1/2 animate-fade-in order-1 md:order-2'
						style={{ animationDelay: '0.2s' }}
					>
						<div className='rounded-2xl shadow-card overflow-hidden'>
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
			</div>
		</section>
	);
};

export default HeroSection;
