'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useUserAuth } from '@/contexts/user';

const navItems = [
	{
		label: 'Talk to AI',
		href: '/ai-chat',
	},
	{
		label: 'Features',
		href: '/#features',
	},
	{
		label: 'Pricing',
		href: '/#pricing',
	},
	{
		label: 'How It Works',
		href: '/#how-it-works',
	},
	{
		label: 'Testimonials',
		href: '/#testimonials',
	},
];

const Header = () => {
	const { user } = useUserAuth();

	return (
		<header className='sticky top-0 z-50 shadow-md bg-white'>
			<div className='container-custom flex justify-between items-center py-4'>
				<Link href='/' className='flex items-center'>
					<Image
						src='/assets/logo/correct.svg'
						alt='Correct Logo'
						width={40}
						height={40}
						className='h-10 w-auto'
					/>
				</Link>

				<nav className='hidden md:flex items-center space-x-8'>
					{navItems.map((item) => (
						<Link key={item.href} href={item.href} className='hover:underline'>
							{item.label}
						</Link>
					))}
				</nav>

				<div className='flex items-center'>
					{user ? (
						<Link href='/dashboard'>
							<Button className='btn-primary'>Dashboard</Button>
						</Link>
					) : (
						<Link href='/login'>
							<Button className='btn-primary'>Login</Button>
						</Link>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
