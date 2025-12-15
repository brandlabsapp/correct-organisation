'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
	title: string;
	message: string;
	buttonText: string;
	onButtonClick: () => void;
}

export default function SuccessModal({
	title,
	message,
	buttonText,
	onButtonClick,
}: SuccessModalProps) {
	return (
		<div className='min-h-screen bg-gray-200 flex flex-col items-center justify-center p-5'>
			<div className='bg-white p-8 rounded-lg w-full max-w-md flex flex-col items-center space-y-4'>
				<div className='w-16 h-16 rounded-full flex items-center justify-center bg-green-100'>
					<CheckCircle className='w-10 h-10 text-green-500' />
				</div>

				<h3 className='text-xl font-semibold text-blue-600 text-center'>{title}</h3>

				<p className='text-gray-600 text-center'>{message}</p>

				<Button
					className='w-full bg-black text-white hover:bg-gray-800'
					onClick={onButtonClick}
				>
					{buttonText}
				</Button>
			</div>
		</div>
	);
}
