import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
	return (
		<div>
			<footer className='border-t'>
				<div className='container flex flex-col gap-4 py-10 md:flex-row md:gap-8'>
					<div className='flex-1 space-y-4'>
						<Link href='/' className='flex items-center space-x-2'>
							<Image
								src='/assets/logo/logo.svg'
								alt='ComplianceAI Logo'
								width={32}
								height={32}
							/>
							<span className='font-bold'>ComplianceAI</span>
						</Link>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							Simplifying compliance management for Indian businesses.
						</p>
					</div>
					<nav className='flex flex-col gap-2 sm:flex-row md:gap-4'>
						<Link href='#' className='text-sm hover:underline'>
							Privacy Policy
						</Link>
						<Link href='#' className='text-sm hover:underline'>
							Terms of Service
						</Link>
						<Link href='#' className='text-sm hover:underline'>
							Contact Us
						</Link>
					</nav>
				</div>
				<div className='border-t py-6 text-center text-sm'>
					<p>© 2024 ComplianceAI. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
};

export default Footer;
