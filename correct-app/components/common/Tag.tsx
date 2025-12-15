import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const tagVariants = cva(
	'items-center justify-center text-xs font-medium transition-colors text-center p-1 rounded-full',
	{
		variants: {
			color: {
				white: 'bg-white text-black',
				beige: 'bg-beige text-black',
				red: 'bg-red text-white',
				default: 'bg-green text-white',
				yellow: 'bg-yellow text-black',
				green: 'bg-green text-white',
				blue: 'bg-blue text-white',
				purple: 'bg-purple text-white',
				orange: 'bg-orange text-white',
				gray: 'bg-gray text-white',
				black: 'bg-black text-white',
				lightgray: 'bg-lightgray text-black',
			},
			width: {
				full: 'w-full',
				auto: 'w-auto',
				sm: 'w-24',
				md: 'w-32',
				lg: 'w-40',
			},
		},
		defaultVariants: {
			color: 'white',
			width: 'md',
		},
	}
);

export interface TagProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
		VariantProps<typeof tagVariants> {
	text: string;
}

const Tag = ({ text, color, width, className, ...props }: TagProps) => {
	return (
		<div className={cn(tagVariants({ color, width, className }))} {...props}>
			{text}
		</div>
	);
};
export default Tag;
