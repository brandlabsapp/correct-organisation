import { retrieveToken } from '@/lib/axiosInstance';
import AIChat from './_components/Chat';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import type { Metadata } from 'next';

interface ChatMessage {
	id: string;
	role: 'user' | 'assistant';
	content: string;
	timestamp?: number;
}

// ----------- Functions----------------

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

// -------------- Metadata --------------

export const metadata: Metadata = {
	title: 'Chat',
	description: 'Chat',
	keywords: [
		'Chat',
		'Compliance',
		'Compliance Management',
		'Compliance Tracker',
	],
};

export default async function AIChatPage(props: {
	searchParams: Promise<{ company: string }>;
}) {
	const searchParams = await props.searchParams;
	const token = await retrieveToken();

	if (!token) {
		return redirect('/login');
	}

	const user = jwtDecode<AppTypes.User>(token);
	const company = searchParams.company;

	const { messages, conversations } = await fetchAllConversations(
		user.id,
		company
	);
	return <AIChat data={messages} conversations={conversations} />;
}
