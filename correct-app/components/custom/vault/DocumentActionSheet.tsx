'use client';

import {
	MoreVertical,
	Share2,
	Download,
	Edit,
	FolderSymlink,
	Trash2,
} from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '../../ui/separator';

interface DocumentActionSheetProps {
	fileName: string;
	fileSize?: string;
	createdAt?: string;
	onShare?: () => void;
	onDownload?: () => void;
	onRename?: () => void;
	onMove?: () => void;
	onDelete?: () => void;
	icon?: React.ReactNode;
}

export function DocumentActionSheet({
	fileName,
	fileSize,
	createdAt,
	onShare,
	onDownload,
	onRename,
	onMove,
	onDelete,
	icon,
}: DocumentActionSheetProps) {
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
							<p className='text-body2 font-medium'>{fileName}</p>
						</SheetTitle>
					</SheetHeader>

					<Separator className='mx-[-20px] w-[calc(100%+40px)] bg-gray-light' />

					<div className='flex justify-between text-sm text-secondarygray-dark'>
						{createdAt && (
							<div>
								<p className='font-medium text-body3'>Created at</p>
								<p className='text-body3'>{createdAt}</p>
							</div>
						)}
						{fileSize && (
							<div>
								<p className='font-medium text-body3'>File Size</p>
								<p className='text-body3'>{parseFloat(fileSize) / 1024} KB</p>
							</div>
						)}
					</div>

					<Separator className='mx-[-20px] w-[calc(100%+40px)] bg-gray-light' />

					<div className='grid gap-2'>
						<button
							onClick={onShare}
							className='flex items-center gap-3 py-2 hover:bg-gray-50 rounded-md'
						>
							<Share2 className='h-5 w-5' />
							<span className='text-body3'>Share</span>
						</button>

						<button
							onClick={onDownload}
							className='flex items-center gap-3 py-2 hover:bg-gray-50 rounded-md'
						>
							<Download className='h-5 w-5' />
							<span className='text-body3'>Download</span>
						</button>

						<button
							onClick={onRename}
							className='flex items-center gap-3 py-2 hover:bg-gray-50 rounded-md'
						>
							<Edit className='h-5 w-5' />
							<span className='text-body3'>Rename</span>
						</button>

						<button
							onClick={onMove}
							className='flex items-center gap-3 py-2 hover:bg-gray-50 rounded-md'
						>
							<FolderSymlink className='h-5 w-5' />
							<span className='text-body3'>Move</span>
						</button>
					</div>

					<Separator className='mx-[-20px] w-[calc(100%+40px)] bg-gray-light' />

					<button
						onClick={onDelete}
						className='flex items-center gap-3 py-2 hover:bg-red-50 rounded-md text-red'
					>
						<Trash2 className='h-5 w-5' />
						<span className='text-body3'>Delete File</span>
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
