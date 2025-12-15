'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Download, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface DocumentItem {
	name: string;
	type: 'pdf' | 'template';
	signed?: boolean;
	downloadable?: boolean;
}

interface DocumentsSectionProps {
	documents: DocumentItem[];
}

export default function DocumentsSection({ documents }: DocumentsSectionProps) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen}>
			<CollapsibleTrigger className='flex items-center justify-between w-full px-5 bg-white rounded-lg'>
				<h2 className='font-semibold text-body1'>Documents</h2>
				{isOpen ? (
					<ChevronUp className='w-5 h-5' />
				) : (
					<ChevronDown className='w-5 h-5' />
				)}
			</CollapsibleTrigger>
			<CollapsibleContent className='mt-3'>
				<Card className='border-0 shadow-none'>
					<CardContent className='p-4 space-y-3 bg-white rounded-lg shadow-none'>
						{documents.map((doc, index) => (
							<div
								key={index}
								className='flex items-center justify-between p-3 border border-dashed border-gray-300 rounded-lg'
							>
								<div className='flex items-center gap-3'>
									{doc.type === 'pdf' ? (
										<div className='w-8 h-8 bg-red-100 rounded flex items-center justify-center'>
											<span className='text-red-600 text-xs font-bold'>PDF</span>
										</div>
									) : (
										<div className='w-8 h-8 bg-gray-100 rounded flex items-center justify-center'>
											<Download className='w-4 h-4 text-gray-600' />
										</div>
									)}
									<div>
										<p className='text-sm font-medium'>{doc.name}</p>
										{doc.downloadable && (
											<button className='text-xs text-blue-600 hover:underline'>
												Download template
											</button>
										)}
									</div>
								</div>
								<div className='flex items-center gap-2'>
									<Download className='w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600' />
									{doc.type === 'pdf' && (
										<MoreHorizontal className='w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600' />
									)}
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</CollapsibleContent>
		</Collapsible>
	);
}
