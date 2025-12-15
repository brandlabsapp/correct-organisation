import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Folder, Plus, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { getFileIcon } from '../utils/file-icons';

interface Document {
	id?: number;
	name: string;
	type: string;
	size?: number;
	url?: string;
	children?: Document[];
	uuid?: string;
	uploadDate?: string;
	description?: string | null;
	filetype?: string;
	extension?: string;
	folderId?: string | number | null;
	createdAt?: string;
	updatedAt?: string;
}

interface ColumnProps {
	currentPath: (string | number)[];
	handleFolderClick: (doc: Document) => void;
	handleViewDocument: (doc: Document) => void;
	handleRemove: (id: string | number | undefined) => void;
	setCurrentPath: (path: (string | number)[]) => void;
}

export const getColumns = ({
	currentPath,
	handleFolderClick,
	handleViewDocument,
	handleRemove,
	setCurrentPath,
}: ColumnProps): ColumnDef<Document>[] => [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => {
			const doc = row.original;
			const depth = currentPath.length;

			return (
				<div
					className='flex items-center'
					style={{ paddingLeft: `${depth * 20}px` }}
				>
					{doc.type === 'folder' ? (
						<>
							<Folder className='mr-2 h-4 w-4 text-blue-500' />
							<div
								className='font-medium cursor-pointer hover:text-blue-600'
								onClick={() => handleFolderClick(doc)}
							>
								{doc.name}
							</div>
						</>
					) : (
						<>
							{getFileIcon(doc.extension)}
							<div
								className='ml-2 cursor-pointer hover:text-blue-600 hover:underline'
								onClick={() => handleViewDocument(doc)}
							>
								{doc.name}
							</div>
						</>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => (
			<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
				{row.original.type}
			</span>
		),
	},
	{
		accessorKey: 'createdAt',
		header: 'Created At',
		cell: ({ row }) => (
			<span className='text-gray-600'>
				{row.original.createdAt &&
					format(new Date(row.original.createdAt), 'MMM d, yyyy')}
			</span>
		),
	},
	{
		accessorKey: 'size',
		header: 'Size',
		cell: ({ row }) => (
			<span className='text-gray-600'>
				{row.original.size
					? `${(row.original.size / 1024 / 1024).toFixed(2)} MB`
					: '-'}
			</span>
		),
	},
	{
		id: 'actions',
		header: 'Actions',
		cell: ({ row }) => {
			const doc = row.original;
			return (
				<div className='flex space-x-1'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => doc.id !== undefined && handleRemove(doc.id)}
						className='h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600'
					>
						<Trash className='h-4 w-4' />
					</Button>
					{doc.type === 'folder' && (
						<Button
							variant='ghost'
							size='icon'
							onClick={() => doc.id && setCurrentPath([...currentPath, doc.id])}
							className='h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600'
						>
							<Plus className='h-4 w-4' />
						</Button>
					)}
				</div>
			);
		},
	},
];
