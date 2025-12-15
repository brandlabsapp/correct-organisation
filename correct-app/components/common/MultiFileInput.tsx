import { FileUpIcon } from 'lucide-react';
import { useState } from 'react';

interface MultiFileInputProps {
	placeholder?: string;
	onValueChange?: (files: File[]) => void;
	multiple?: boolean;
	disabled?: boolean;
	id?: string;
}

export const MultiFileInput = ({
	placeholder,
	onValueChange,
	multiple,
	disabled,
	id,
}: MultiFileInputProps) => {
	const [fileNames, setFileNames] = useState<string[]>([]);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const fileArray = Array.from(files);
			setFileNames(fileArray.map((file) => file.name));
			onValueChange?.(fileArray);
		}
	};

	const getDisplayText = () => {
		if (fileNames.length === 0) {
			return placeholder || 'Select file(s)';
		}
		if (fileNames.length === 1) {
			return fileNames[0];
		}
		return `${fileNames.length} files selected`;
	};

	return (
		<div className='relative w-full h-12'>
			<input
				id={id}
				type='file'
				className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
				onChange={handleFileChange}
				multiple={multiple}
				disabled={disabled}
			/>
			<div className='w-full flex justify-between items-center gap-2 px-5 h-full border border-input rounded-md bg-white mt-3'>
				<span className='text-sm text-gray-500 truncate'>{getDisplayText()}</span>
				<FileUpIcon className='text-black min-h-6 min-w-6 opacity-50' />
			</div>
		</div>
	);
};
