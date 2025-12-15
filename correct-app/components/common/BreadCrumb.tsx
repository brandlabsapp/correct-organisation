import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbProps {
	currentFolder?: string | null;
	folders: any[];
	onNavigate: (folder: any | null) => void;
	rootFolder: any;
}

//!!TODO:Implement the types

export function Breadcrumb({
	currentFolder,
	folders,
	onNavigate,
	rootFolder,
}: BreadcrumbProps) {
	return (
		<div className='flex items-center space-x-2 text-xs md:text-sm'>
			<Button variant='ghost' onClick={() => onNavigate(null)}>
				Home
			</Button>

			<div key={rootFolder?.id} className='flex items-center'>
				<ChevronRight className='h-4 w-4 text-gray-500' />
				<Button
					variant='ghost'
					onClick={() => onNavigate(rootFolder)}
					className={'font-bold'}
				>
					{rootFolder?.name}
				</Button>
			</div>
		</div>
	);
}
