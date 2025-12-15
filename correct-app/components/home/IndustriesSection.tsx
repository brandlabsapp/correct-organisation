import React from 'react';
import {
	Pill,
	Car,
	Banknote,
	ShoppingCart,
	Package,
	Factory,
	Building2,
	Stethoscope,
} from 'lucide-react';

const IndustriesSection = () => {
	const industries = [
		{ name: 'Pharma', icon: <Pill className='h-12 w-12 text-primary' /> },
		{ name: 'Automobile', icon: <Car className='h-12 w-12 text-primary' /> },
		{
			name: 'NBFCs & FinTech',
			icon: <Banknote className='h-12 w-12 text-primary' />,
		},
		{
			name: 'Retail & FMCG',
			icon: <ShoppingCart className='h-12 w-12 text-primary' />,
		},
		{ name: 'Logistics', icon: <Package className='h-12 w-12 text-primary' /> },
		{
			name: 'Manufacturing',
			icon: <Factory className='h-12 w-12 text-primary' />,
		},
		{
			name: 'Real Estate',
			icon: <Building2 className='h-12 w-12 text-primary' />,
		},
		{
			name: 'Healthcare',
			icon: <Stethoscope className='h-12 w-12 text-primary' />,
		},
	];

	return (
		<section id='industries' className='bg-white section-padding'>
			<div className='container-custom'>
				<div className='text-center mb-16'>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>
						Industries We Support
					</h2>
					<p className='text-xl text-deepgrey max-w-3xl mx-auto'>
						Tailored compliance solutions for India&apos;s most regulated sectors.
					</p>
				</div>

				<div className='flex overflow-x-auto pb-6 md:grid md:grid-cols-8 gap-4 md:gap-6'>
					{industries.map((industry, index) => (
						<div
							key={index}
							className='feature-card text-center hover:border-primary hover:border-2 transition-all cursor-pointer min-w-[120px] flex-shrink-0'
						>
							<div className='flex justify-center mb-4'>{industry.icon}</div>
							<h3 className='text-lg font-bold'>{industry.name}</h3>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default IndustriesSection;
