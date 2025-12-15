'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '../ui/button';
import { driverObj } from '@/hooks/useDriver';
import { Info } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { navItems } from '@/data/static/nav';

const publicPages = ['/privacy-policy', '/terms-and-conditions'];

const Header = () => {
	const startTour = () => {
		driverObj.drive();
	};
	const pathname = usePathname();
	const isPathAdmin =
		pathname.includes('admin') ||
		pathname.includes('onboarding') ||
		pathname.includes('auth');

	useEffect(() => {
		const newUser = localStorage.getItem('newUser');
		if (newUser === 'true' && !isPathAdmin) {
			driverObj.drive();
		}
		localStorage.setItem('newUser', 'false');
	}, [isPathAdmin]);

	const isPublicPage = publicPages.includes(pathname);

	const isLandingPage = pathname === '/';
	const filteredNavItems = isLandingPage ? navItems : [];
	const hideRideTour = isPublicPage || isPathAdmin || isLandingPage;

	if (isPublicPage) {
		return (
			<header className='sticky top-0 z-50 min-w-full bg-white border-b border-gray-200'>
				<div className='flex h-14 items-center px-2'>
					<Link href='/' className='flex items-center space-x-2'>
						<Image
							src='/assets/logo/logo.svg'
							alt='ComplianceAI Logo'
							width={32}
							height={32}
							className='h-10 w-auto'
						/>
						<span className='font-bold'>Correct App</span>
					</Link>
				</div>
			</header>
		);
	}

	return (
		<header className='sticky top-0 z-50 min-h-14 bg-white border-b border-gray-200'>
			<div className='flex h-14 items-center px-2'>
				<Link href='/' className='flex items-center space-x-2'>
					<Image
						src='/assets/logo/logo.svg'
						alt='ComplianceAI Logo'
						width={32}
						height={32}
					/>
					<span className='font-bold'>Correct App</span>
				</Link>
				<nav className='ml-auto  gap-4 items-center md:flex'>
					{!hideRideTour && (
						<Button onClick={startTour} variant='ghost' size='icon'>
							<Info className='h-10 w-10' />
						</Button>
					)}
					{filteredNavItems.map((item) => (
						<Link key={item.href} href={item.href} className='text-sm font-medium'>
							{item.icon ? (
								<Button variant='ghost' size='icon'>
									{item.icon}
									<span className='sr-only'>{item.label}</span>
								</Button>
							) : (
								item.label
							)}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
};

export default Header;
