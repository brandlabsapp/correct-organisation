import { FileUpIcon } from 'lucide-react';
import { useState } from 'react';

interface FileInputProps {
	placeholder: string;
	onChange?: (file: File) => void;
}

export const FileInput = ({ placeholder, onChange }: FileInputProps) => {
	const [fileName, setFileName] = useState<string>('');

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFileName(file.name);
			onChange?.(file);
		}
	};

	return (
		<div className='relative w-full h-12'>
			<input
				type='file'
				className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
				onChange={handleFileChange}
			/>
			<div className='w-full flex justify-between items-center gap-2 px-5 h-full border border-input rounded-md bg-white mt-3'>
				<span className='text-sm text-gray-500'>{fileName || placeholder}</span>
				<FileUpIcon className='text-black min-h-6 min-w-6 opacity-50' />
			</div>
		</div>
	);
};
