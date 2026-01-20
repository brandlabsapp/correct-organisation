'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/contexts/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Send,
	Plus,
	Upload,
	FileText,
	MessageSquare,
	User,
	Bot,
	LogOut,
	X,
	Menu,
} from 'lucide-react';
import Markdown from '@/components/common/Markdown';
import { format } from 'date-fns';
import {
	showLoadingToast,
	showSuccessToast,
	showErrorToast,
} from '@/lib/utils/toast-handlers';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile {
	id?: string;
	name: string;
	url: string;
	size: number;
	type: string;
	extension: string;
}

interface Message {
	id: string;
	content: string;
	role: 'user' | 'assistant';
	timestamp: Date;
	files?: File[];
	uploadedFiles?: UploadedFile[];
}

interface ChatSession {
	id: string;
	title: string;
	messages: Message[];
	lastUpdated: Date;
}

const AIChatPage = () => {
	const router = useRouter();
	const { user, logout, company, isAuthenticated, isLoading: isAuthLoading } = useUserAuth();
	const { dismiss } = useToast();
	const [currentMessage, setCurrentMessage] = useState('');
	const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
	const [chatSessions, setChatSessions] = useState<ChatSession[]>([
		{
			id: '1',
			title: 'Compliance Questions',
			messages: [
				{
					id: '1',
					content: "Hello! I'm your compliance assistant. How can I help you today?",
					role: 'assistant',
					timestamp: new Date(),
				},
			],
			lastUpdated: new Date(),
		},
	]);
	const [activeChatId, setActiveChatId] = useState('1');
	const [isMessageLoading, setIsMessageLoading] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const activeChat = chatSessions.find((chat) => chat.id === activeChatId);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [activeChat?.messages]);

	useEffect(() => {
		const pendingMessage = sessionStorage.getItem('pendingMessage');
		const pendingFilesStr = sessionStorage.getItem('pendingFiles');

		if (pendingMessage) {
			setCurrentMessage(pendingMessage);
			sessionStorage.removeItem('pendingMessage');
		}

		if (pendingFilesStr) {
			try {
				const pendingFiles = JSON.parse(pendingFilesStr);
				const files = pendingFiles.map((fileData: any) => {
					const byteCharacters = atob(fileData.data.split(',')[1]);
					const byteNumbers = new Array(byteCharacters.length);
					for (let i = 0; i < byteCharacters.length; i++) {
						byteNumbers[i] = byteCharacters.charCodeAt(i);
					}
					const byteArray = new Uint8Array(byteNumbers);
					return new File([byteArray], fileData.name, { type: fileData.type });
				});
				setAttachedFiles(files);
				sessionStorage.removeItem('pendingFiles');
			} catch (error) {
				console.error('Error parsing pending files:', error);
			}
		}
	}, []);

	const createNewChat = () => {
		const newChatId = Date.now().toString();
		const newChat: ChatSession = {
			id: newChatId,
			title: 'New Compliance Chat',
			messages: [
				{
					id: Date.now().toString(),
					content: "Hello! I'm your compliance assistant. How can I help you today?",
					role: 'assistant',
					timestamp: new Date(),
				},
			],
			lastUpdated: new Date(),
		};

		setChatSessions((prev) => [newChat, ...prev]);
		setActiveChatId(newChatId);
		setIsDrawerOpen(false);
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

	const uploadFilesToStorage = async (
		files: File[]
	): Promise<UploadedFile[]> => {
		const uploadedFiles: UploadedFile[] = [];

		for (const file of files) {
			const loading = showLoadingToast({
				title: 'Uploading...',
				message: `Uploading ${file.name}...`,
			});

			try {
				const formData = new FormData();
				formData.append('file', file);
				if (user?.id) {
					formData.append('userId', user.id.toString());
				}
				if (company?.id) {
					formData.append('companyId', company.id.toString());
				}
				formData.append('source', 'marketing-chat');

				const response = await fetch('/api/document/upload', {
					method: 'POST',
					body: formData,
				});

				const { data, success } = await response.json();

				if (!success) {
					dismiss(loading.id);
					showErrorToast({
						title: 'Upload Failed',
						message: `Failed to upload ${file.name}. Please try again.`,
					});
					continue;
				}

				dismiss(loading.id);
				uploadedFiles.push({
					id: data?.id,
					name: file.name,
					url: data?.url || '',
					size: file.size,
					type: file.type,
					extension: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
				});
			} catch (error) {
				console.error(`Error uploading ${file.name}:`, error);
				dismiss(loading.id);
				showErrorToast({
					title: 'Upload Error',
					message: `Failed to upload ${file.name}. Please try again.`,
				});
			}
		}

		if (uploadedFiles.length > 0 && uploadedFiles.length === files.length) {
			showSuccessToast({
				title: 'Files Uploaded',
				message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
			});
		}

		return uploadedFiles;
	};

	const handleSendMessage = async () => {
		if (!currentMessage.trim() && attachedFiles.length === 0) return;
		if (!activeChat) return;

		// Check authentication before sending message
		if (isAuthLoading) return; // Wait for initial auth check if refreshing

		if (!isAuthenticated || !user) {
			// Store the message for after login
			sessionStorage.setItem('pendingMessage', currentMessage.trim());
			sessionStorage.setItem('loginSource', 'ai-chat');
			router.push('/login?redirect=ai-chat');
			return;
		}

		const messageToSend = currentMessage;
		const filesToUpload = [...attachedFiles];
		setCurrentMessage('');
		setAttachedFiles([]);
		setIsMessageLoading(true);

		let uploadedFiles: UploadedFile[] = [];
		if (filesToUpload.length > 0) {
			uploadedFiles = await uploadFilesToStorage(filesToUpload);
		}

		const userMessage: Message = {
			id: Date.now().toString(),
			content: messageToSend,
			role: 'user',
			timestamp: new Date(),
			files: filesToUpload.length > 0 ? filesToUpload : undefined,
			uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : undefined,
		};

		setChatSessions((prev) =>
			prev.map((chat) =>
				chat.id === activeChatId
					? {
						...chat,
						messages: [...chat.messages, userMessage],
						lastUpdated: new Date(),
					}
					: chat
			)
		);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user.token || localStorage.getItem('Authentication')}`,
				},
				body: JSON.stringify({
					messages: [{ role: 'user', content: messageToSend }],
					data: {
						userId: user?.id,
						companyId: company?.id,
						conversationId: activeChatId === '1' ? undefined : parseInt(activeChatId),
					},
					files: uploadedFiles,
				}),
			});

			const data = await response.json();

			if (data.success) {
				console.log('data from ai chat', data);
				// The proxy returns { data: { botContent, ... }, success: true }
				let assistantContent = data.data?.botContent;

				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					content:
						assistantContent ||
						'I apologize, but I encountered an error processing your request.',
					role: 'assistant',
					timestamp: new Date(),
				};

				// Update activeChatId if the response contains a new conversation ID
				if (data.data?.conversation?.id && activeChatId === '1') {
					setActiveChatId(String(data.data.conversation.id));
				}

				setChatSessions((prev) =>
					prev.map((chat) =>
						chat.id === activeChatId
							? {
								...chat,
								messages: [...chat.messages, assistantMessage],
								lastUpdated: new Date(),
							}
							: chat
					)
				);
			} else {
				showErrorToast({
					title: 'Error',
					message: data.message || 'Failed to get response',
				});
				// Restore message text on error
				setCurrentMessage(messageToSend);
			}
		} catch (error) {
			console.error('Error in handleSendMessage:', error);
			showErrorToast({
				title: 'Error',
				message: 'An error occurred while sending the message',
			});
			setCurrentMessage(messageToSend);
		} finally {
			setIsMessageLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleLogout = () => {
		logout();
	};

	const handleChatSelect = (chatId: string) => {
		setActiveChatId(chatId);
		setIsDrawerOpen(false);
	};

	return (
		<div className='flex h-[calc(100vh-3.7rem)] bg-gray-50  relative'>
			{isDrawerOpen && (
				<div
					className='fixed inset-0 bg-black/50 z-40 md:hidden'
					onClick={() => setIsDrawerOpen(false)}
				/>
			)}

			<div
				className={`absolute md:relative z-50 w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
					} h-full`}
			>
				<div className='p-4 border-b border-gray-200'>
					<div className='flex items-center justify-between mb-3 md:mb-0'>
						<Button onClick={createNewChat} className='flex-1 md:w-full text-white'>
							<Plus className='w-4 h-4 mr-2' />
							New Chat
						</Button>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setIsDrawerOpen(false)}
							className='md:hidden ml-2'
							aria-label='Close menu'
						>
							<X className='w-5 h-5' />
						</Button>
					</div>
				</div>

				<ScrollArea className='flex-1 p-2'>
					{chatSessions.map((chat) => (
						<div
							key={chat.id}
							onClick={() => handleChatSelect(chat.id)}
							className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${activeChatId === chat.id
								? 'bg-blue text-white'
								: 'hover:bg-gray-50 text-gray-900'
								}`}
						>
							<div className='flex items-center'>
								<MessageSquare
									className={`w-4 h-4 mr-2 ${activeChatId === chat.id ? 'text-black' : 'text-gray-500'
										}`}
								/>
								<div className='flex-1 min-w-0'>
									<p
										className={`text-sm font-medium truncate ${activeChatId === chat.id ? 'text-black' : 'text-gray-900'
											}`}
									>
										{chat.title}
									</p>
									<p
										className={`text-xs ${activeChatId === chat.id ? 'text-black' : 'text-gray-500'
											}`}
									>
										{chat.messages.length} messages
									</p>
								</div>
							</div>
						</div>
					))}
				</ScrollArea>

				<div className='p-3.5 border-t border-gray-200'>
					<div className='flex items-center space-x-3 h-10'>
						<div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
							<User className='w-4 h-4 text-white' />
						</div>
						<div className='flex-1'>
							<p className='text-sm font-medium text-gray-900'>
								{user?.name || user?.phone || 'User'}
							</p>
							<p className='text-xs text-gray-500'>Compliance Assistant</p>
						</div>
						<Button
							variant='ghost'
							size='sm'
							onClick={handleLogout}
							className='text-gray-700'
						>
							<LogOut className='w-4 h-4' />
						</Button>
					</div>
				</div>
			</div>

			<div className='flex-1 flex flex-col min-h-0 bg-white'>
				<div className='hidden md:flex bg-white border-b border-gray-200 p-4'>
					<div className='flex items-center'>
						<Bot className='w-6 h-6 mr-3 text-gray-700' />
						<div>
							<h1 className='text-lg font-semibold text-gray-900'>
								Compliance Assistant
							</h1>
							<p className='text-sm text-gray-500'>
								Ask questions about regulations, upload documents for analysis
							</p>
						</div>
					</div>
				</div>

				<div className='md:hidden flex items-center justify-between p-3 border-b border-gray-200'>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => setIsDrawerOpen(true)}
						className='text-gray-700'
						aria-label='Open menu'
					>
						<Menu className='w-5 h-5' />
					</Button>
					<h1 className='text-base font-semibold text-gray-900'>
						Compliance Assistant
					</h1>
					<div className='w-10' />
				</div>

				<ScrollArea className='flex-1 p-4 md:p-4 overflow-y-scroll bg-white'>
					<div className='max-w-4xl mx-auto space-y-4'>
						{activeChat?.messages.length === 1 &&
							activeChat?.messages[0]?.role === 'assistant' && (
								<div className='flex items-center justify-center h-full min-h-[60vh] md:min-h-[50vh]'>
									<p className='text-gray-500 text-center'>
										What can I help with all compliances?
									</p>
								</div>
							)}
						{activeChat?.messages.map((message) => (
							<div
								key={message.id}
								className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
									}`}
							>
								<div
									className={`max-w-[85%] md:max-w-[70%] rounded-lg px-4 py-3 ${message.role === 'user'
										? 'bg-accent text-white'
										: 'bg-white border border-gray-200 text-gray-900'
										}`}
								>
									{message.files && message.files.length > 0 && (
										<div className='mb-3 space-y-2'>
											{message.files.map((file, index) => {
												const uploadedFile = message.uploadedFiles?.[index];
												return (
													<div
														key={index}
														className='flex items-center justify-between bg-blue-50 rounded px-2 py-1 text-sm'
													>
														<div className='flex items-center flex-1 min-w-0'>
															<FileText className='w-4 h-4 text-blue-600 mr-2 shrink-0' />
															<span className='text-blue-800 truncate'>{file.name}</span>
														</div>
														{uploadedFile?.url && (
															<a
																href={uploadedFile.url}
																target='_blank'
																rel='noopener noreferrer'
																className='ml-2 text-blue-600 hover:text-blue-800 shrink-0'
																aria-label={`Open ${file.name}`}
															>
																<Upload className='w-3 h-3' />
															</a>
														)}
													</div>
												);
											})}
										</div>
									)}
									<Markdown content={message.content} />
									<p
										className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
											}`}
									>
										{format(message.timestamp, 'HH:mm')}
									</p>
								</div>
							</div>
						))}
						{isMessageLoading && (
							<div className='flex justify-start mb-4'>
								<div className='bg-gray-100 rounded-2xl px-4 py-2 flex items-center space-x-2'>
									<div className='animate-pulse flex space-x-1'>
										<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
										<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
										<div className='w-2 h-2 bg-gray-400 rounded-full'></div>
									</div>
									<span className='text-sm text-gray-500'>Analyzing...</span>
								</div>
							</div>
						)}

						<div ref={messagesEndRef} />
					</div>
				</ScrollArea>

				<div className='bg-white border-t border-gray-200 p-3.5'>
					<div className='max-w-4xl mx-auto'>
						{attachedFiles.length > 0 && (
							<div className='mb-3 flex flex-wrap gap-2'>
								{attachedFiles.map((file, index) => (
									<div
										key={index}
										className='flex items-center bg-blue-50 rounded-lg px-3 py-2 text-sm'
									>
										<FileText className='w-4 h-4 text-blue-600 mr-2' />
										<span className='text-blue-800 text-xs md:text-sm'>{file.name}</span>
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

						<div className='flex items-center gap-2 h-10'>
							<Button
								size='sm'
								type='button'
								variant='ghost'
								onClick={() => document.getElementById('file-upload-chat')?.click()}
								disabled={isMessageLoading}
								aria-label='Upload file'
								className='h-10 w-10 shrink-0 rounded-full p-0 text-gray-600 hover:bg-gray-100'
							>
								<Plus className='h-5 w-5' />
							</Button>
							<input
								type='file'
								id='file-upload-chat'
								multiple
								accept='.pdf,.doc,.docx,.txt,.xlsx,.xls'
								onChange={handleFileAttach}
								className='hidden'
							/>
							<div className='flex-1 relative'>
								<Input
									value={currentMessage}
									onChange={(e) => setCurrentMessage(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder='Ask anything about compliances'
									className='w-full h-12 md:h-12 text-sm md:text-base rounded-2xl pr-24 md:pr-24 bg-gray-100 border-0 focus-visible:ring-2 focus-visible:ring-accent placeholder:text-gray-500'
									disabled={isMessageLoading}
								/>
								<div className='absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1'>
									<Button
										onClick={handleSendMessage}
										disabled={
											(!currentMessage.trim() && attachedFiles.length === 0) || isMessageLoading
										}
										aria-label='Send'
										className='h-10 w-10 shrink-0 rounded-full bg-blue-600 p-0 text-white hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400'
									>
										{isMessageLoading ? (
											<div className='h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
										) : (
											<Send className='h-5 w-5' />
										)}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AIChatPage;
