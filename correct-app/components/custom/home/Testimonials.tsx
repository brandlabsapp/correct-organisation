import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import React from 'react';

type Props = {
	testimonials: home.ITestimonial[];
};

const Testimonials = ({ testimonials }: Props) => {
	return (
		<section id='testimonials' className='py-12 md:py-24 lg:py-32'>
			<div className='container px-4 md:px-6'>
				<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12'>
					What Our Clients Say
				</h2>
				<Carousel className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto'>
					<CarouselContent>
						{testimonials.map((testimonial, index) => (
							<CarouselItem key={index}>
								<Card>
									<CardContent className='p-6 text-center'>
										<p className='mb-4 italic'>{testimonial.quote}</p>
										<p className='font-semibold'>{testimonial.name}</p>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											{testimonial.company}
										</p>
									</CardContent>
								</Card>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</section>
	);
};

export default Testimonials;
