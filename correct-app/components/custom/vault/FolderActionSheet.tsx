'use client';

import {
	MoreVertical,
	Share2,
	Edit,
	FolderSymlink,
	Trash2,
	Folder,
} from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '../../ui/separator';
// Replaced moment with date-fns for smaller bundle size
import { format } from 'date-fns';

interface FolderActionSheetProps {
	folderName: string;
	createdAt?: string;
	itemCount?: number;
	onShare?: () => void;
	onRename?: () => void;
	onMove?: () => void;
	onDelete?: () => void;
	icon?: React.ReactNode;
}

export function FolderActionSheet({
	folderName,
	createdAt,
	itemCount,
	onShare,
	onRename,
	onMove,
	onDelete,
	icon = <Folder className='h-5 w-5 mr-2 text-blue-500' />,
}: FolderActionSheetProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<MoreVertical className='h-5 w-5' />
			</SheetTrigger>
			<SheetContent
				side='bottom'
				className='rounded-t-xl bg-lightgray min-h-[200px] p-5'
			>
				<div className='flex flex-col gap-4'>
					<SheetHeader className='pb-0'>
						<SheetTitle className='flex items-center'>
							{icon}
							<p className='text-body2 font-medium'>{folderName}</p>
						</SheetTitle>
					</SheetHeader>

					<Separator className='mx-[-20px] w-[calc(100%+40px)] bg-gray-light' />

					<div className='flex justify-between text-sm text-secondarygray-dark'>
						{createdAt && (
							<div>
								<p className='font-medium text-body3'>Created at</p>
								<p className='text-body3'>{format(new Date(createdAt), 'PPPPpppp')}</p> {/* date-fns format: full date and time */}
							</div>
						)}
						{itemCount !== undefined && (
							<div>
								<p className='font-medium text-body3'>Contents</p>
								<p className='text-body3'>{itemCount} items</p>
							</div>
						)}
					</div>

					<Separator className='mx-[-20px] w-[calc(100%+40px)] bg-gray-light' />

					<div className='grid gap-2'>
						<button
							onClick={onRename}
							className='flex items-center gap-3 py-2 hover:bg-gray-50 rounded-md'
						>
							<Edit className='h-5 w-5' />
							<span className='text-body3'>Rename</span>
						</button>
					</div>

					<Separator className='mx-[-20px] w-[calc(100%+40px)] bg-gray-light' />

					<button
						onClick={onDelete}
						className='flex items-center gap-3 py-2 hover:bg-red-50 rounded-md text-red'
					>
						<Trash2 className='h-5 w-5' />
						<span className='text-body3'>Delete Folder</span>
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
