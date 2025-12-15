'use client';

import Header from './Header';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import FeaturesSection from './FeaturesSection';
import PricingSection from './PricingSection';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import Footer from './Footer';

const HomePage = () => {
	return (
		<div className='min-h-screen bg-white'>
			<Header />
			<main>
				<HeroSection />
				<ProblemSection />
				<FeaturesSection />
				<PricingSection />
				<HowItWorksSection />
				<TestimonialsSection />
				<CTASection />
			</main>
			<Footer />
		</div>
	);
};

export default HomePage;
