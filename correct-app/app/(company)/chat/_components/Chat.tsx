'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat-message';
import { SendHorizontal, Upload, Plus } from 'lucide-react';
import { FileUploader } from '@/components/custom/vault/file-uploader';
import { useChat, type Message } from 'ai/react';
import { showErrorToast, showSuccessToast } from '@/lib/utils/toast-handlers';
import { useUserAuth } from '@/contexts/user';
import { SidebarLayout } from '@/components/common/sidebar-layout';

interface ChatMessageData extends Omit<Message, 'role'> {
	role: 'user' | 'assistant';
	timestamp?: number;
}

interface ChatConversation {
	id: string;
	messages: ChatMessageData[];
	createdAt?: number;
	updatedAt?: number;
}

interface AIChatProps {
	data: ChatMessageData[];
	conversations: ChatConversation[];
}

export default function AIChat({ data, conversations }: AIChatProps) {
	const [showUploader, setShowUploader] = useState(false);
	const [conversation, setConversation] = useState<ChatConversation[]>(
		Array.isArray(conversations) ? conversations : []
	);
	const [currentConversationId, setCurrentConversationId] = useState<
		string | null
	>(conversations?.[0]?.id || null);
	const [isStoringQuery, setIsStoringQuery] = useState(false);
	const [isCreatingConversation, setIsCreatingConversation] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const { user, company } = useUserAuth();

	const initialMessages = useMemo((): Message[] => {
		return Array.isArray(data)
			? data.map((msg) => ({
					id: msg.id,
					content: msg.content,
					role: msg.role as Message['role'],
			  }))
			: [];
	}, [data]);

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		setMessages,
		isLoading,
	} = useChat({
		initialMessages: initialMessages,
		onResponse: async (response) => {
			console.log('response from chat route', response);
			try {
				if (response.status === 200) {
					const { data: responseData, success } = await response.json();

					if (!success) {
						showErrorToast({ error: responseData });
						return;
					}

					if (responseData?.conversation) {
						const newMessage: Message = {
							id: responseData.messageId || Date.now().toString(),
							role: 'assistant' as const,
							content: responseData.botContent || '',
						};

						setConversation(responseData.conversation.id);
						setMessages((prevMessages: Message[]) => [...prevMessages, newMessage]);
					}
				} else if (response.status === 429) {
					showErrorToast({ error: 'Rate limit exceeded. Please try again later.' });
				} else {
					showErrorToast({ error: 'Failed to send message. Please try again.' });
				}
			} catch (error) {
				console.error('Error processing response:', error);
				showErrorToast({ error: 'An unexpected error occurred.' });
			}
		},
	});

	const scrollToBottom = useCallback(() => {
		if (scrollAreaRef.current) {
			const scrollContainer = scrollAreaRef.current.querySelector(
				'[data-radix-scroll-area-viewport]'
			);
			if (scrollContainer) {
				scrollContainer.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: 'smooth',
				});
			}
		}
	}, []);

	useEffect(() => {
		const timeoutId = setTimeout(scrollToBottom, 100);
		return () => clearTimeout(timeoutId);
	}, [messages, scrollToBottom]);

	const handleSendMessage = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			if (!input.trim() || isLoading || isStoringQuery) return;

			setIsStoringQuery(true);

			try {
				await handleSubmit(e, {
					data: {
						userId: user?.id ?? null,
						companyId: company?.id ?? null,
						conversationId: currentConversationId,
					},
				});
			} catch (error) {
				console.error('Error sending message:', error);
				showErrorToast({ error: 'Failed to send message. Please try again.' });
			} finally {
				setIsStoringQuery(false);
			}
		},
		[
			input,
			isLoading,
			isStoringQuery,
			handleSubmit,
			user?.id,
			company?.id,
			currentConversationId,
		]
	);

	const handleFileUpload = useCallback((files: File) => {
		setShowUploader(false);
		console.log('File uploaded:', files);
	}, []);

	const showUploaderHandler = useCallback(() => setShowUploader(true), []);
	const hideUploaderHandler = useCallback(() => setShowUploader(false), []);

	// TODO: Uncomment this when we have a new conversation feature
	// const createNewConversation = useCallback(async () => {
	// 	if (!user?.id || !company?.id || isCreatingConversation) return;

	// 	setIsCreatingConversation(true);
	// 	try {
	// 		const response = await fetch('/api/chat/new-conversation', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify({
	// 				userId: user.id,
	// 				companyId: company.id,
	// 			}),
	// 		});

	// 		const result = await response.json();

	// 		if (result.success) {
	// 			const newConversationId = result.data.id;
	// 			setCurrentConversationId(newConversationId);
	// 			setMessages([]); // Clear current messages
	// 			showSuccessToast({ message: 'New conversation started!' });
	// 		} else {
	// 			showErrorToast({
	// 				error: result.message || 'Failed to create new conversation',
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error('Error creating new conversation:', error);
	// 		showErrorToast({ error: 'Failed to create new conversation' });
	// 	} finally {
	// 		setIsCreatingConversation(false);
	// 	}
	// }, [user?.id, company?.id, isCreatingConversation, setMessages]);

	const loadingMessage = useMemo(
		(): Message => ({
			id: 'loading',
			role: 'assistant' as const,
			content: 'Typing...',
		}),
		[]
	);

	const sendButtonText = useMemo(() => {
		if (isStoringQuery) return 'Sending...';
		if (isLoading) return 'Loading...';
		return 'Send';
	}, [isStoringQuery, isLoading]);

	const isDisabled = isLoading || isStoringQuery || !input.trim();

	return (
		<SidebarLayout>
			<div className='flex flex-col h-full overflow-hidden bg-gray-50'>
				<div className='bg-white border-b border-gray-200 p-3 md:p-4'>
					<div className='flex items-start justify-between gap-3'>
						<div className='flex-1 min-w-0'>
							<h1 className='text-lg md:text-xl font-semibold text-gray-900'>Chat</h1>
							<p className='text-xs md:text-sm text-gray-600 truncate'>
								Ask questions about compliance and regulations
							</p>
						</div>
						{/* <Button
							onClick={createNewConversation}
							disabled={isCreatingConversation}
							variant='outline'
							size='sm'
							className='flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 py-1.5 md:py-2 shrink-0'
						>
							<Plus className='h-3 w-3 md:h-4 md:w-4' />
							<span className='hidden sm:inline'>
								{isCreatingConversation ? 'Creating...' : 'New Chat'}
							</span>
							<span className='sm:hidden'>
								{isCreatingConversation ? '...' : 'New'}
							</span>
						</Button> */}
					</div>
				</div>

				<div className='flex-1 flex flex-col min-h-0'>
					<div className='flex-1 overflow-hidden'>
						<ScrollArea
							className='h-full px-3 md:px-4 py-2 md:py-4'
							ref={scrollAreaRef}
						>
							<div className='w-full'>
								{Array.isArray(messages) && messages.length > 0 ? (
									messages.map((message) => (
										<ChatMessage key={message.id} message={message} />
									))
								) : (
									<div className='text-center py-8 md:py-12 px-4'>
										<div className='bg-white rounded-lg p-4 md:p-8 shadow-sm border border-gray-200 max-w-sm md:max-w-md mx-auto'>
											<div className='w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4'>
												<svg
													className='w-5 h-5 md:w-6 md:h-6 text-gray-600'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
													/>
												</svg>
											</div>
											<h3 className='text-base md:text-lg font-medium text-gray-900 mb-2'>
												Welcome to Chat
											</h3>
											<p className='text-sm md:text-base text-gray-600'>
												Start a conversation by typing a message below.
											</p>
										</div>
									</div>
								)}
								{isLoading && <ChatMessage message={loadingMessage} />}
							</div>
						</ScrollArea>
					</div>

					<div className='bg-white border-t border-gray-200 p-3 md:p-4 pb-safe'>
						<div className='w-full'>
							<form onSubmit={handleSendMessage} className='flex gap-2 md:gap-3'>
								<div className='flex-1'>
									<Input
										value={input}
										onChange={handleInputChange}
										placeholder='Type your message here...'
										className='w-full h-10 md:h-12 text-sm md:text-base'
										disabled={isLoading || isStoringQuery}
									/>
								</div>
								<Button
									size='sm'
									type='button'
									variant='outline'
									onClick={showUploaderHandler}
									disabled={isLoading || isStoringQuery}
									aria-label='Upload file'
									className='h-10 md:h-12 w-10 md:w-12 shrink-0'
								>
									<Upload className='h-3 w-3 md:h-4 md:w-4' />
								</Button>
								<Button
									size='sm'
									type='submit'
									disabled={isDisabled}
									aria-label={sendButtonText}
									className='h-10 md:h-12 px-3 md:px-6 shrink-0'
								>
									<SendHorizontal className='h-3 w-3 md:h-4 md:w-4 mr-0 md:mr-2' />
									<span className='hidden sm:inline text-sm md:text-base'>
										{sendButtonText}
									</span>
								</Button>
							</form>
						</div>
					</div>
				</div>

				{showUploader && (
					<FileUploader
						onFileUpload={handleFileUpload}
						onClose={hideUploaderHandler}
					/>
				)}
			</div>
		</SidebarLayout>
	);
}
