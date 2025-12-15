import { File, FileIcon, FileText, Image as ImageIcon } from 'lucide-react';

export const getFileIcon = (extension: string | undefined) => {
	switch (extension?.toLowerCase()) {
		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'gif':
			return <ImageIcon className='h-4 w-4 text-purple-500' />;
		case 'pdf':
			return <FileIcon className='h-4 w-4 text-red-500' />;
		case 'xlsx':
		case 'xls':
		case 'csv':
			return <FileIcon className='h-4 w-4 text-green-500' />;
		case 'doc':
		case 'docx':
			return <FileText className='h-4 w-4 text-blue-500' />;
		default:
			return <File className='h-4 w-4 text-gray-500' />;
	}
};
