declare namespace dashboard {
	export interface IChecklistCard {
		id: number;
		title: string;
		type: string;
		timeframe: string;
		compliance: {
			id: number;
			title: string;
			description: string;
			category: string;
			applicability: string;
			purpose: string;
			dueDateRule: string;
			penalties: string;
			section: string;
			rules: string;
			recurrence: string;
			createdAt: string;
			updatedAt: string;
			content: '';
		};
	}
	export interface ITaskCard {
		id: number;
		title: string;
		timeframe: string;
		assigneeImageUrl: string;
		assigneeName?: string;
		task: {
			id: number;
			uuid: string;
			title: string;
			description: string;
			deadline: string;
			complianceId: number;
			createdAt: string;
			updatedAt: string;
		};
	}
}
