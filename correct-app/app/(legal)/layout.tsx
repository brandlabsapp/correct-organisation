import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Correct App | Legal',
	description: 'Legal information for Correct App',
};

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='bg-white text-black py-10 px-4'>
			<div className='max-w-4xl mx-auto'>
				<main>{children}</main>
			</div>
			<footer className='mt-10 pt-8 border-t border-gray-200 text-sm text-gray-500'>
				<div className='flex justify-between'>
					<div>© {new Date().getFullYear()} Correct App. All rights reserved.</div>
					<div className='flex gap-4'>
						<Link href='/privacy-policy' className='hover:underline'>
							Privacy Policy
						</Link>
						<Link href='/terms-and-conditions' className='hover:underline'>
							Terms & Conditions
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
