import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateFolderProps {
	onCreateFolder: (folderName: string) => void;
	onClose: () => void;
}

export function CreateFolder({ onCreateFolder, onClose }: CreateFolderProps) {
	const [folderName, setFolderName] = useState('');

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFolderName(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (folderName.trim()) {
			onCreateFolder(folderName.trim());
			onClose();
		}
	};

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			<div>
				<Label htmlFor='folderName'>Folder Name</Label>
				<Input
					id='folderName'
					value={folderName}
					onChange={handleOnChange}
					placeholder='Enter folder name'
				/>
			</div>
			<Button type='submit'>Create Folder</Button>
		</form>
	);
}
