declare namespace Chat {
	export interface Message {
		id: number;
		uuid: string;
		content: string;
		role: 'user' | 'assistant';
		timestamp: number;
		fileId?: string[];
		files?: File[];
	}

	export interface Conversation {
		id: number;
		uuid: string;
		userId: string;
		companyId: string;
		messages: Message[];
		createdAt: number;
		updatedAt: number;
	}
}
