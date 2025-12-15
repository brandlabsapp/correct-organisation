'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Upload, FileText, X } from 'lucide-react';

const CorrectPage = () => {
	const router = useRouter();
	const [message, setMessage] = useState('');
	const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

	const handleSendMessage = () => {
		if (!message.trim() && attachedFiles.length === 0) return;

		// Store the message and files in sessionStorage to persist after login
		if (message.trim()) {
			sessionStorage.setItem('pendingMessage', message);
		}
		if (attachedFiles.length > 0) {
			// Convert files to base64 for storage
			const filePromises = attachedFiles.map((file) => {
				return new Promise<{ name: string; type: string; data: string }>(
					(resolve) => {
						const reader = new FileReader();
						reader.onload = () => {
							resolve({
								name: file.name,
								type: file.type,
								data: reader.result as string,
							});
						};
						reader.readAsDataURL(file);
					}
				);
			});

			Promise.all(filePromises).then((fileData) => {
				sessionStorage.setItem('pendingFiles', JSON.stringify(fileData));
			});
		}

		// Set source for redirect tracking
		sessionStorage.setItem('loginSource', 'ai-chat');

		// Redirect to login
		router.push('/login?redirect=ai-chat');
	};

	const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files) {
			const newFiles = Array.from(files);
			setAttachedFiles((prev) => [...prev, ...newFiles]);
		}
	};

	const removeFile = (index: number) => {
		setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className='min-h-screen bg-white flex items-center justify-center p-4'>
			<div className='w-full max-w-4xl'>
				{/* Header */}
				<div className='text-center mb-8'>
					<h1 className='text-5xl font-bold text-gray-900 mb-4'>
						Ask anything about <span className='text-blue-600'>compliance</span>
					</h1>
					<p className='text-xl text-gray-600 mb-2'>
						Get instant answers to your compliance questions
					</p>
					<p className='text-lg text-gray-500'>
						Upload documents, ask questions, and ensure regulatory compliance
					</p>
				</div>

				{/* Main Input Area */}
				<div className='relative'>
					<div className='bg-white rounded-2xl p-6 border-2 border-blue-100 shadow-xl hover:border-blue-200 transition-colors'>
						<div className='flex items-center space-x-3'>
							<Input
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder='Ask about compliance requirements, regulations, or upload documents for analysis...'
								className='flex-1 bg-transparent border-none text-gray-900 placeholder:text-gray-400 text-lg focus:ring-0 focus:outline-none'
							/>
						</div>

						{/* Attached Files Display */}
						{attachedFiles.length > 0 && (
							<div className='mt-4 flex flex-wrap gap-2'>
								{attachedFiles.map((file, index) => (
									<div
										key={index}
										className='flex items-center bg-blue-50 rounded-lg px-3 py-2 text-sm'
									>
										<FileText className='w-4 h-4 text-blue-600 mr-2' />
										<span className='text-blue-800'>{file.name}</span>
										<button
											onClick={() => removeFile(index)}
											className='ml-2 text-blue-400 hover:text-blue-600'
										>
											<X className='w-4 h-4' />
										</button>
									</div>
								))}
							</div>
						)}

						<div className='flex items-center justify-between mt-4'>
							<div className='flex items-center space-x-2'>
								<input
									type='file'
									id='file-upload'
									multiple
									accept='.pdf,.doc,.docx,.txt,.xlsx,.xls'
									onChange={handleFileAttach}
									className='hidden'
								/>
								<Button
									variant='ghost'
									size='sm'
									className='text-gray-500 hover:text-gray-700'
									onClick={() => document.getElementById('file-upload')?.click()}
								>
									<Upload className='w-4 h-4 mr-2' />
									Upload Files
								</Button>
							</div>
							<Button
								onClick={handleSendMessage}
								disabled={!message.trim() && attachedFiles.length === 0}
								className='bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full px-6 py-2 font-medium'
							>
								<Send className='w-4 h-4 mr-2' />
								Ask Correct
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CorrectPage;
