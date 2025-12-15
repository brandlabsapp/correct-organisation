import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-w-0',
	{
		variants: {
			variant: {
				default: 'bg-black text-white shadow',
				destructive: 'bg-red text-white shadow-sm',
				outline: 'border border-input bg-white shadow-sm',
				secondary: 'bg-secondary text-secondary-foreground shadow-sm',
				ghost: '',
				link: 'text-black underline-offset-4 hover:underline',
				lightgray: 'bg-lightgray text-black',
				lightBlue: 'bg-blue text-black',
				white: 'bg-white text-black',
				success: 'bg-green text-white',
				red: 'bg-red text-white',
				lightRed: 'bg-red-light text-white',
				black: 'bg-black text-white',
			},
			size: {
				default: 'h-12 px-6 py-2 text-base',
				sm: 'h-8 rounded-md px-3 text-xs',
				md: 'h-10 rounded-md px-3 text-xs',
				lg: 'h-14 rounded-md px-8 text-lg',
				xs: 'h-7 rounded px-2 text-xs',
				icon: 'h-9 w-9 p-0',
			},
			radius: {
				default: 'rounded-[10px]',
				full: 'rounded-full',
				compact: 'rounded-md',
			},
			fullWidth: {
				true: 'w-full',
				false: '',
			},
		},

		defaultVariants: {
			variant: 'default',
			size: 'default',
			radius: 'default',
			fullWidth: false,
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			loading = false,
			fullWidth = false,
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, fullWidth, className }))}
				ref={ref}
				disabled={loading || props.disabled}
				{...props}
			>
				{loading ? (
					<>
						<svg
							className='animate-spin'
							xmlns='http://www.w3.org/2000/svg'
							width='1em'
							height='1em'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path d='M21 12a9 9 0 1 1-6.219-8.56' />
						</svg>
						{children}
					</>
				) : (
					children
				)}
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
