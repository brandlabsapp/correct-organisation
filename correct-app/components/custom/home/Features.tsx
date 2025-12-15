import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

type Props = {
	features: home.IFeature[];
};

const Features = ({ features }: Props) => {
	return (
		<section id='features' className='py-12 md:py-24 lg:py-32 bg-gray-100'>
			<div className='container px-4 md:px-6'>
				<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12'>
					Key Features
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{features.map((feature, index) => (
						<Card key={index}>
							<CardContent className='p-6'>
								<h3 className='font-bold text-xl mb-2'>{feature.title}</h3>
								<p className='text-gray-500 dark:text-gray-400'>
									{feature.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
