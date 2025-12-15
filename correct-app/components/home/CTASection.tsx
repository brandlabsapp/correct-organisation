import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CTASection = () => {
	return (
		<section className='section-padding'>
			<div className='container-custom'>
				<div className='text-center max-w-3xl mx-auto'>
					<h2 className='text-mobile-heading1 md:text-subheading1 font-bold mb-4'>
						Join 100+ growing businesses simplifying compliance
					</h2>
					<p className='text-mobile-heading3 md:text-heading3 text-deepgrey mb-8'>
						Experience the peace of mind that comes with automated compliance
						management.
					</p>
					<Link href='/ai-chat'>
						<Button className='btn-primary rounded-full shadow-soft transition-all flex items-center gap-2 mx-auto'>
							Start Now for Free <ArrowRight size={20} />
						</Button>
					</Link>
					<p className='mt-8 text-mobile-heading3 md:text-heading3 text-deepgrey'>
						Need more information? Contact us at
						<Link
							href='mailto:contact@brandlabs.app'
							className='font-bold ml-2 hover:underline'
						>
							contact@correctapp.ai
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default CTASection;
