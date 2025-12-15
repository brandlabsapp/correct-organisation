declare namespace vault {
	export interface Document {
		id?: number | null;
		uuid?: string;
		name: string;
		type: string;
		folderId?: string | number | null;
		size?: number;
		uploadDate?: string;
		key?: string;
		url?: string;
		extension?: string;
		createdAt?: string;
		updatedAt?: string;
		description?: string | null;
		filetype?: string;
		children?: any;
	}
	export interface Folder {
		id?: number | null;
		uuid?: string;
		name: string;
		parentId?: number | null;
		userId?: number | null;
		companyId?: number | null;
		createdAt?: string;
		updatedAt?: string;
		description?: string | null;
		itemCount?: number;
		children?: any;
	}
}
