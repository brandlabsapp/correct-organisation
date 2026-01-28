'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUserAuth } from '@/contexts/user';
import AIChat from './_components/Chat';
import { LoadingFallback } from '@/components/common/LoadingFallback';

interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp?: number;
}

interface ChatConversation {
	id: string;
	messages: ChatMessage[];
	createdAt?: number;
	updatedAt?: number;
}

const fetchAllConversations = async (
	userId: number,
	companyId: string
): Promise<{ messages: ChatMessage[]; conversations: ChatConversation[] }> => {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
		const response = await fetch(`${baseUrl}/api/chat/${userId}/${companyId}`);
		const data = await response.json();
		let result: { messages: ChatMessage[]; conversations: ChatConversation[] } = {
			messages: [],
			conversations: [],
		};

		if (data.success) {
			result.conversations = data.data;
			const conversation = data?.data[0];
			if (conversation) {
				const messages: ChatMessage[] =
					conversation?.messages?.flatMap((message: any) => {
						const result: ChatMessage[] = [];
						if (message?.userContent) {
							result.push({
								id: message.uuid + '-user',
								content: message.userContent,
								role: 'user' as const,
								timestamp: message.createdAt || Date.now(),
							});
						}
						if (message?.botContent) {
							result.push({
								id: message.uuid + '-bot',
								content: message.botContent,
								role: 'assistant' as const,
								timestamp: message.createdAt || Date.now(),
							});
						}
						return result;
					}) || [];
				result.messages = messages;
			}
		}

		return result;
	} catch (err) {
		return { messages: [], conversations: [] };
	}
};

export default function AIChatPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { user, isAuthenticated, isLoading: isAuthLoading } = useUserAuth();
	const company = searchParams.get('company');

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [conversations, setConversations] = useState<ChatConversation[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (isAuthLoading) return;

		if (!isAuthenticated || !user) {
			router.push('/login');
			return;
		}

		const loadData = async () => {
			try {
				const result = await fetchAllConversations(user.id, company || '');
				setMessages(result.messages);
				setConversations(result.conversations);
			} catch (error) {
				console.error('Failed to fetch conversations:', error);
			} finally {
				setIsLoading(false);
			}
		};

		loadData();
	}, [user, company, isAuthenticated, isAuthLoading, router]);

	if (isAuthLoading || isLoading) {
		return <LoadingFallback />;
	}

	return <AIChat data={messages} conversations={conversations} />;
}
