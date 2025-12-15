import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
	'flex border bg-transparent transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none text-black disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
	{
		variants: {
			variant: {
				default: 'rounded-md h-12 px-3 py-1 border-secondarygray',
				rounded: 'rounded-full h-12 py-3.5 shadow-sm border-gray-100',
			},
			state: {
				default: '',
				success: 'border-green focus-visible:ring-green',
				destructive: 'border-destructive focus-visible:ring-destructive',
			},
			hasIcon: {
				true: '',
				false: '',
			},
			iconPosition: {
				left: '',
				right: '',
			},
			width: {
				full: 'w-full',
			},
		},
		compoundVariants: [
			{
				hasIcon: true,
				iconPosition: 'left',
				variant: 'default',
				className: 'pl-10',
			},
			{
				hasIcon: true,
				iconPosition: 'left',
				variant: 'rounded',
				className: 'pl-14',
			},
			{
				hasIcon: true,
				iconPosition: 'right',
				variant: 'default',
				className: 'pr-10',
			},
			{
				hasIcon: true,
				iconPosition: 'right',
				variant: 'rounded',
				className: 'pr-14',
			},
		],
		defaultVariants: {
			variant: 'default',
			state: 'default',
			hasIcon: false,
			iconPosition: 'left',
		},
	}
);

const iconContainerVariants = cva('absolute top-1/2 -translate-y-1/2', {
	variants: {
		iconPosition: {
			left: 'left-3',
			right: 'right-3',
		},
	},
	defaultVariants: {
		iconPosition: 'left',
	},
});

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {
	icon?: React.ReactNode;
	error?: string;
	width?: 'full';
	iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			children,
			icon,
			variant,
			state = 'default',
			error,
			hasIcon,
			iconPosition = 'left',
			width,
			...props
		},
		ref
	) => {
		const hasIconValue = icon ? true : false;

		return (
			<div className='flex flex-col gap-2 w-full'>
				<div className='relative'>
					<input
						type={type}
						className={cn(
							inputVariants({
								variant,
								state: error ? 'destructive' : state,
								hasIcon: hasIconValue,
								iconPosition,
								className,
								width,
							})
						)}
						ref={ref}
						{...props}
					/>
					{icon && (
						<div className={cn(iconContainerVariants({ iconPosition }))}>{icon}</div>
					)}
					{children}
					{error && <p className='text-sm text-destructive'>{error}</p>}
				</div>
			</div>
		);
	}
);

Input.displayName = 'Input';

export { Input };
