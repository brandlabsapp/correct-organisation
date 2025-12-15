import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
	title: string;
	linkText?: string;
	linkHref?: string;
	children: ReactNode;
	className?: string;
}

export const Section = ({
	title,
	linkText,
	linkHref,
	children,
	className,
}: SectionProps) => (
	<section className={cn('mb-6', className)}>
		<div className='flex justify-between items-center space-y-2.5'>
			<h2 className='text-sm text-gray-500'>{title}</h2>
			{linkText && linkHref && (
				<Link href={linkHref} className='text-sm text-blue-500'>
					{linkText}
				</Link>
			)}
		</div>
		<div className='space-y-2'>{children}</div>
	</section>
);
