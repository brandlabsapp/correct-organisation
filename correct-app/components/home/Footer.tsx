import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
	return (
		<footer className='bg-white py-12'>
			<div className='container-custom'>
				<div className='flex flex-col md:flex-row justify-between items-center mb-8'>
					<div className='mb-6 md:mb-0'>
						<Link
							href='/'
							className='flex items-center justify-center md:justify-start'
						>
							<Image
								src='/assets/logo/correct.svg'
								alt='Correct Logo'
								width={40}
								height={40}
								className='h-10 w-auto object-contain'
							/>
						</Link>
						<p className='mt-2 text-deepgrey'>
							AI-powered compliance for Indian businesses
						</p>
					</div>

					<div className='flex flex-wrap justify-center gap-6'>
						<Link href='/privacy-policy' className='hover:underline'>
							Privacy Policy
						</Link>
						<Link href='/terms-and-conditions' className='hover:underline'>
							Terms & Conditions
						</Link>
					</div>
				</div>

				<div className='border-t border-gray-200 pt-8 text-center text-sm text-deepgrey'>
					<p>
						&copy; {new Date().getFullYear()} VITRARECT IT SERVICES PRIVATE LIMITED.
						All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
