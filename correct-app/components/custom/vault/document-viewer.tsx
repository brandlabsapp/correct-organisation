import { Suspense, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

interface DocumentViewerProps {
	document: vault.Document;
	onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
	const [activeTab, setActiveTab] = useState('preview');

	const renderPreview = () => {
		switch (document?.extension) {
			case 'PDF':
				return (
					<iframe
						src={document.url}
						className='w-full h-[400px] md:h-[70vh] rounded-lg'
						title={`Preview of ${document.name}`}
					/>
				);
			case 'DOCX':
				return (
					<div className='flex flex-col items-center justify-center p-4'>
						<FileText className='h-24 w-24 text-gray-400' />
						<p className='mt-4 text-center text-sm text-gray-500'>
							Preview not available for DOCX files. Please download to view.
						</p>
					</div>
				);
			case 'JPG':
			case 'PNG':
			case 'JPEG':
			case 'SVG':
				return (
					<Image
						src={document.url || ''}
						alt={`Preview of ${document.name}`}
						className='max-w-full max-h-[400px] md:max-h-[70vh] object-contain'
						height={700}
						width={900}
					/>
				);
			default:
				return (
					<div className='flex flex-col items-center justify-center p-4'>
						<FileText className='h-24 w-24 text-gray-400' />
						<p className='mt-4 text-center text-sm text-gray-500'>
							Preview not available for this file type.
						</p>
					</div>
				);
		}
	};

	return (
		<Dialog open={true} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[900px] md:max-w-[90vw] lg:max-w-[1100px] bg-lightgray'>
				<DialogHeader>
					<DialogTitle>{document.name}</DialogTitle>
					<DialogDescription>
						Type: {document.extension} | Size:{' '}
						{document.size ? (document.size / 1000000).toFixed(2) : 'N/A'}
						MB | Last Modified:{' '}
						{document.createdAt
							? format(new Date(document.createdAt), 'MM/dd/yyyy')
							: 'N/A'}
					</DialogDescription>
				</DialogHeader>
				<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
					<TabsList>
						<TabsTrigger value='preview'>Preview</TabsTrigger>
					</TabsList>
					<TabsContent value='preview' className='mt-4'>
						<Suspense fallback={<div>Loading...</div>}>{renderPreview()}</Suspense>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
