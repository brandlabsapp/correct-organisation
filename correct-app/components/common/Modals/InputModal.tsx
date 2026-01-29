import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	placeholder: string;
	buttonText: string;
	onClick: () => void;
	title: string;
	value: string;
	setValue: (value: string) => void;
};

const InputModal = ({
	open,
	onOpenChange,
	placeholder,
	buttonText,
	onClick,
	title,
	value,
	setValue,
}: Props) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md rounded-lg space-y-3 p-4 bg-white'>
				<DialogHeader>
					<DialogTitle className='text-center font-medium text-body1'>
						{title}
					</DialogTitle>
				</DialogHeader>
				<Input
					placeholder={placeholder}
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className='rounded-lg w-full text-body1'
				/>
				<Button
					onClick={onClick}
					className='w-full bg-black text-white hover:bg-gray-800'
				>
					{buttonText}
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default InputModal;
