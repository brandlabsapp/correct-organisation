import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Tag from './Tag';
import { Skeleton } from '../ui/skeleton';

interface TextCardProps {
	href?: string;
	title: string;
	subTitle?: string;
	description: string;
	subDescription?: string;
	content?: React.ReactNode;
	icon?: React.ReactNode;
	background?: string;
	className?: string;
	tags?: string[];
	loading?: boolean;
}

export const TextCard: React.FC<TextCardProps> = ({
	title,
	description,
	subDescription,
	content,
	icon,
	href,
	background = 'bg-white',
	className,
	tags,
	loading,
}) => {
	if (loading) {
		return <SkeletonCard />;
	}
	return (
		<>
			{href ? (
				<Link href={href} aria-label={title}>
					<CardComponent
						title={title}
						description={description}
						subDescription={subDescription}
						icon={icon}
						background={background}
						className={className}
						tags={tags}
						content={content}
					/>
				</Link>
			) : (
				<CardComponent
					title={title}
					description={description}
					subDescription={subDescription}
					icon={icon}
					background={background}
					className={className}
					tags={tags}
					content={content}
				/>
			)}
		</>
	);
};

export const CardComponent = ({
	title,
	description,
	subDescription,
	icon,
	background = 'bg-white',
	className,
	tags,
	content,
}: TextCardProps) => {
	return (
		<Card
			className={cn(
				'flex w-full p-5 border border-transparent  rounded-xl shadow-md transition',
				background,
				className
			)}
		>
			<div className='flex flex-col justify-center w-full'>
				<CardHeader className='flex items-start justify-between pb-2'>
					<CardTitle className='text-sm font-medium flex items-start gap-2'>
						<h3 className='text-body2 md:text-heading3 font-bold text-green'>
							{title}
						</h3>
					</CardTitle>
				</CardHeader>
				<CardContent className='space-y-2'>
					<p className='text-body2 md:text-body1 text-black'>{description}</p>
					<p className='text-body3 md:text-body2 text-grey'>{subDescription}</p>
					{content}
					{tags?.map((tag, index) => (
						<Tag key={index} text={tag} />
					))}
				</CardContent>
			</div>
			{icon && <div className='flex items-center justify-end'>{icon}</div>}
		</Card>
	);
};

const SkeletonCard = () => {
	return (
		<Card
			className={cn(
				'flex w-full p-5 border border-transparent rounded-xl shadow-md transition'
			)}
		>
			<div className='flex flex-col justify-center w-full space-y-4'>
				<CardHeader className='flex items-start justify-between pb-2'>
					<Skeleton className='h-6 w-3/4' />
				</CardHeader>
				<CardContent className='space-y-2'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-5/6' />
				</CardContent>
			</div>
		</Card>
	);
};
