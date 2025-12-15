import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { showErrorToast } from '@/lib/utils/toast-handlers';

interface FileUploaderProps {
	onFileUpload: (files: File) => void;
	onClose: () => void;
}

export function FileUploader({ onFileUpload, onClose }: FileUploaderProps) {
	const [files, setFiles] = useState<File[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const MAX_FILE_SIZE = 2 * 1024 * 1024;

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);

		const validFiles = selectedFiles.filter((file) => {
			if (file.size > MAX_FILE_SIZE) {
				showErrorToast({
					title: 'File too large',
					message: `${file.name} exceeds 5MB limit`,
				});
				return false;
			}
			return true;
		});

		setFiles((prevFiles) => [...prevFiles, ...validFiles]);
	};

	const handleUpload = () => {
		if (files.length === 0) {
			showErrorToast({
				title: 'No files selected',
				message: 'Please select at least one file to upload.',
			});
			return;
		}
		files.forEach((file) => onFileUpload(file));
		setFiles([]);
		onClose();
	};

	const removeFile = (index: number) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<div className='space-y-4'>
				<div
					className='border-2 border-dashed rounded-lg p-4 text-center cursor-pointer'
					onClick={() => fileInputRef.current?.click()}
				>
					<Upload className='mx-auto h-12 w-12 text-gray-400' />
					<p className='mt-2 text-sm text-gray-600'>
						Click to select files or drag and drop
					</p>
				</div>
				<input
					type='file'
					ref={fileInputRef}
					onChange={handleFileInput}
					multiple
					className='hidden'
				/>
				{files.length > 0 && (
					<ul className='space-y-2'>
						{files.map((file, index) => (
							<li
								key={index}
								className='flex items-center justify-between bg-gray-100 rounded px-2 py-1'
							>
								<span className='text-sm'>{file.name}</span>
								<Button variant='ghost' size='sm' onClick={() => removeFile(index)}>
									<X className='h-4 w-4' />
								</Button>
							</li>
						))}
					</ul>
				)}
				<div className='flex justify-end space-x-2'>
					<Button variant='outline' onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleUpload}>Upload</Button>
				</div>
			</div>
		</form>
	);
}
