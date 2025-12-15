'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface OverviewContent {
	purpose: string;
	detailedInfo: string;
	applicableLaw: string;
	penalty: string;
}

interface OverviewSectionProps {
	content: OverviewContent;
}

export default function OverviewSection({ content }: OverviewSectionProps) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className='flex items-center justify-between w-full px-4 bg-white rounded-lg'>
				<h2 className='font-semibold text-body1'>Overview</h2>
				{isOpen ? (
					<ChevronUp className='w-5 h-5' />
				) : (
					<ChevronDown className='w-5 h-5' />
				)}
			</CollapsibleTrigger>
			<CollapsibleContent className='mt-3'>
				<Card className='border-0 shadow-none'>
					<CardContent className='p-4 space-y-4 bg-white rounded-lg shadow-none'>
						<div>
							<h3 className='font-medium mb-2'>Purpose</h3>
							<p className='text-sm text-gray-600'>{content.purpose}</p>
						</div>
						<div>
							<h3 className='font-medium mb-2'>Detailed Info</h3>
							<p className='text-sm text-gray-600'>{content.detailedInfo}</p>
						</div>
						<div>
							<h3 className='font-medium mb-2'>Applicable Law</h3>
							<p className='text-sm text-gray-600'>{content.applicableLaw}</p>
						</div>
						<div>
							<h3 className='font-medium mb-2'>Penalty for Non-Compliance</h3>
							<p className='text-sm text-gray-600'>{content.penalty}</p>
						</div>
					</CardContent>
				</Card>
			</CollapsibleContent>
		</Collapsible>
	);
}
