'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ComplianceDetailHeaderProps {
	title: string;
	badgeText: string;
	dueDateText: string;
	daysLeftText: string;
	progressPercentage: number;
	backLink: string;
}

export default function ComplianceDetailHeader({
	title,
	badgeText,
	dueDateText,
	daysLeftText,
	progressPercentage,
	backLink,
}: ComplianceDetailHeaderProps) {
	return (
		<div className='bg-white px-5 py-4 border-b-2 border-lightgray-dark'>
			<div className='flex items-center gap-3 mb-4'>
				<Link href={backLink}>
					<ArrowLeft className='w-6 h-6 text-green-600' />
				</Link>
				<span className='text-green-600 text-sm'>Back</span>
			</div>

			<div className='flex items-center gap-5 justify-between mb-4'>
				<h1 className='xs:text-body1 sm:text-heading4 font-semibold'>{title}</h1>
				<Badge variant='secondary' className='bg-purple-100 min-w-fit text-body4'>
					{badgeText}
				</Badge>
			</div>

			<div className='flex items-center justify-between text-body3 text-gray-600 mb-2'>
				<span>{dueDateText}</span>
				<span>{daysLeftText}</span>
			</div>

			<div className='w-full bg-gray-200 rounded-full h-1'>
				<div
					className='bg-green-500 h-1 rounded-full'
					style={{ width: `${progressPercentage}%` }}
				></div>
			</div>
		</div>
	);
}
