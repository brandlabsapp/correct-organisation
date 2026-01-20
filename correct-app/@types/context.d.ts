declare namespace AppTypes {
	export interface User {
		id: number;
		name: string;
		email: string;
		phone?: string;
		roles?: string[];
		dateOfBirth?: string;
		createdAt?: Date;
		updatedAt?: Date;
		token: string;
		address?: string;
		companyDetails?: Company[];
		companyMembers?: any[];
	}

	export interface Admin {
		id: number;
		name: string;
		email: string;
		phone?: string;
		roles?: string[];
		createdAt?: Date;
		updatedAt?: Date;
	}

	export interface Company {
		id: number;
		name: string;
		type: string;
		incorporationDate: string;
		address: string;
		city: string;
		state: string;
		zip: string;
		industry: string;
		revenue: string;
		size: string;
		teamSize: number;
		din: string;
		referralCode?: string;
	}

	export interface Member {
		id: number;
		name: string;
		email: string;
		role: string;
		invitationToken: string;
		invitedAt: Date;
		lastAccessedAt: Date;
		professionalDetails: {
			directorDin: string;
		};
		status: string;
		acceptedAt: Date;
		companyId: number;
		createdAt: Date;
		deletedAt: Date | null;
		userId: number;
		uuid: string;
		user: User;
	}

	export interface UserAuthContextType {
		user: User | null;
		isAuthenticated: boolean;
		isLoading: boolean;
		login: (userData: User) => void;
		logout: () => void;
		updateUser: (userData: User) => void;
		company: Company | null;
		updateCompany: (company: Company) => void;
		fetchCompanyDetails: (companyId: string | number) => void;
		updateCurrentCompany: (companyId: number) => void;
		members: Member[];
		setMembers: (members: Member[]) => void;
	}

	export interface AdminAuthContextType {
		admin: Admin | null;
		login: (adminData: Admin) => void;
		logout: () => void;
		updateAdmin: (adminData: Admin) => void;
	}
}
