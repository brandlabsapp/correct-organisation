'use client';
import React from 'react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';

const TestimonialsSection = () => {
	const testimonials = [
		{
			quote:
				'Correct has saved us countless hours and resources that we now put back into growing our business.',
			author: 'Vikram Singh',
			company: 'PharmaTech Solutions',
		},
		{
			quote:
				"The AI assistant is like having a compliance expert on call 24/7. It's been a game-changer for us.",
			author: 'Ananya Desai',
			company: 'AutoSpares India',
		},
		{
			quote:
				'As a growing retail chain, keeping track of compliances was a nightmare before Correct.',
			author: 'Rohit Jain',
			company: 'Urban Market',
		},
	];

	return (
		<section id='testimonials' className='bg-white section-padding'>
			<div className='container-custom'>
				<div className='text-center mb-16'>
					<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
						What Our Customers Say
					</h2>
					<p className='text-mobile-heading3 md:text-heading3 text-deepgrey max-w-3xl mx-auto'>
						Hear from businesses who&apos;ve simplified their compliance journey with
						Correct.
					</p>
				</div>

				<div className='md:hidden'>
					<Carousel
						opts={{ align: 'start', loop: true }}
						className='w-full relative'
					>
						<CarouselContent className='-ml-4'>
							{testimonials.map((testimonial, index) => (
								<CarouselItem key={index} className='pl-4 basis-full'>
									<div className='feature-card'>
										<div className='text-mobile-heading1 md:text-subheading1 mb-1'>
											&ldquo;
										</div>
										<p className='mb-6 text-center text-mobile-heading3 md:text-heading3 text-deepgrey italic'>
											{testimonial.quote}
										</p>
										<div className='text-center md:text-left'>
											<p className='text-body2 font-bold'>{testimonial.author}</p>
											<p className='text-body2 text-deepgrey'>{testimonial.company}</p>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className='left-0 top-1/2 -translate-y-1/2 z-10' />
						<CarouselNext className='right-0 top-1/2 -translate-y-1/2 z-10' />
					</Carousel>
				</div>

				<div className='hidden md:grid grid-cols-1 md:grid-cols-3 gap-8'>
					{testimonials.map((testimonial, index) => (
						<div key={index} className='feature-card'>
							<div className='text-heading1 md:text-heading1 mb-4'>&ldquo;</div>
							<p className='text-deepgrey mb-6 italic'>{testimonial.quote}</p>
							<div>
								<p className='text-body2 md:text-body1 font-bold'>
									{testimonial.author}
								</p>
								<p className='text-body2 md:text-body1 text-deepgrey'>
									{testimonial.company}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TestimonialsSection;
