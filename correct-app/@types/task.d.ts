declare namespace checklist {
	export interface Compliance {
		formName: string;
		state: string;
		category: string;
		completed: string;
	}

	export interface Task {
		id: number;
		title: string;
		completed: boolean;
		dueDate: string;
		description?: string;
		category?: string;
		start?: Date;
		end?: Date;
		status?: string;
		compliance: Compliance;
	}
}
