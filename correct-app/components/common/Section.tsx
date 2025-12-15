import React from 'react';
import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';

const sectionVariants = cva('w-full  min-h-screen', {
	variants: {
		size: {
			sm: 'py-4 md:py-6',
			md: 'py-6 md:py-8',
			lg: 'py-8 md:py-12',
			xl: 'py-12 md:py-16',
		},
		padding: {
			none: 'px-0',
			sm: 'px-4',
			md: 'px-6',
			lg: 'px-8',
			xl: 'px-12',
		},
		background: {
			black: 'bg-black',
			white: 'bg-white',
		},
		container: {
			default: 'max-w-screen-xl mx-auto',
			sm: 'max-w-screen-sm mx-auto',
			md: 'max-w-screen-md mx-auto',
			lg: 'max-w-screen-lg mx-auto',
			full: 'w-full',
		},
	},
	defaultVariants: {
		size: 'md',
		padding: 'sm',
		background: 'black',
		container: 'default',
	},
});

interface SectionProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof sectionVariants> {
	children: React.ReactNode;
	containerClassName?: string;
}

const Section = ({
	children,
	className,
	containerClassName,
	size,
	padding,
	background,
	container,
	...props
}: SectionProps) => {
	return (
		<section
			className={cn(
				sectionVariants({
					size,
					padding,
					background,
					container,
					className,
				})
			)}
			{...props}
		>
			<div className={cn('w-full', containerClassName)}>{children}</div>
		</section>
	);
};

export default Section;
