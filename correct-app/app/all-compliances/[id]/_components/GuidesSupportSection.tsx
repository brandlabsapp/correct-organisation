'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { LearnCard } from '@/components/common/LearnCard';

interface FrameworkDoc {
	title: string;
	category: string;
	date: string;
	imageUrl: string;
}

interface GuidesSupportSectionProps {
	videoTitle: string;
	videoSubtitle: string;
	videoEvent: string;
	videoTag1: string;
	videoTag2: string;
	frameworkDocs: FrameworkDoc[];
}

export default function GuidesSupportSection({
	videoTitle,
	videoSubtitle,
	videoEvent,
	videoTag1,
	videoTag2,
	frameworkDocs,
}: GuidesSupportSectionProps) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className='flex items-center justify-between w-full px-5 bg-white rounded-lg'>
				<h2 className='font-semibold text-body1'>Guides & Support</h2>
				{isOpen ? (
					<ChevronUp className='w-5 h-5' />
				) : (
					<ChevronDown className='w-5 h-5' />
				)}
			</CollapsibleTrigger>
			<CollapsibleContent className='mt-3'>
				<Card className='border-0 shadow-sm'>
					<CardContent className='p-4 space-y-4 bg-white rounded-lg shadow-none'>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
							{frameworkDocs.map((doc, index) => (
								<LearnCard
									key={index}
									title={doc.title}
									publishedDate={doc.date}
									category={doc.category}
									imageUrl={doc.imageUrl}
								/>
							))}
						</div>

						<Button className='w-full bg-gray-900 hover:bg-gray-800 text-white'>
							Ask Questions
						</Button>
					</CardContent>
				</Card>
			</CollapsibleContent>
		</Collapsible>
	);
}
