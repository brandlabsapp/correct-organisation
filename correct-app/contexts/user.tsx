'use client';

import { clearCookies } from '@/utils/common/common';
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useCallback,
	useRef,
} from 'react';
import { useRouter } from 'next/navigation';
import { showErrorToast } from '@/lib/utils/toast-handlers';
import { allowedRoutes } from '@/utils/constants/constant';

const UserAuthContext = createContext<AppTypes.UserAuthContextType | undefined>(
	undefined
);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<AppTypes.User | null>(null);
	const [company, setCompany] = useState<AppTypes.Company | null>(null);
	const [members, setMembers] = useState<AppTypes.Member[]>([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const isInitializingRef = useRef(false);
	const hasInitializedRef = useRef(false);

	const router = useRouter();

	const login = (userData: AppTypes.User) => {
		setUser(userData);
		setIsAuthenticated(true);
	};

	const logout = () => {
		setUser(null);
		setIsAuthenticated(false);
		clearCookies('Authentication');
		router.push('/');
	};

	const updateUser = (userData: AppTypes.User) => setUser(userData);

	const updateCompany = (companyData: AppTypes.Company) =>
		setCompany(companyData);

	const fetchCompanyDetails = useCallback(
		async (companyId?: string | number) => {
			const currentQuery = new URLSearchParams(window.location.search);
			const queryCompanyId = currentQuery.get('company');
			const localComapanyId = localStorage.getItem('companyId');
			const formattedcompanyId = queryCompanyId || companyId || localComapanyId;
			if (!formattedcompanyId) return;
			localStorage.setItem('companyId', String(formattedcompanyId));
			const response = await fetch(`/api/profile/company/${formattedcompanyId}`);
			const data = await response.json();
			if (data.success) {
				setCompany(data.data);
				setMembers(data.data.members);
			} else {
				showErrorToast({
					title: 'Error',
					message: data.message || 'Failed to fetch company details',
				});
				if (response.status === 401) {
					clearCookies('Authentication');
					clearCookies('companyId');
					localStorage.clear();
					router.push('/login');
				}
			}
		},
		[router]
	);

	useEffect(() => {
		const initializeUser = async () => {
			if (hasInitializedRef.current || isInitializingRef.current) {
				return;
			}

			hasInitializedRef.current = true;
			isInitializingRef.current = true;

			const pathname = window.location.pathname;
			if (allowedRoutes.includes(pathname)) {
				isInitializingRef.current = false;
				setIsLoading(false);
				return;
			}

			try {
				const response = await fetch('/api/profile/me');
				const data = await response.json();
				if (data.success) {
					if (!allowedRoutes.includes(pathname)) {
						await fetchCompanyDetails();
					}
					setUser(data.data);
					setIsAuthenticated(true);
				} else {
					if (response.status === 401) {
						showErrorToast({
							title: 'Failed to Authenticate',
							message: data.message || 'Failed to authenticate. Please try again.',
						});
						setUser(null);
						setIsAuthenticated(false);
						clearCookies('Authentication');
						router.push('/');
					} else {
						showErrorToast({
							title: 'Error',
							message: data.message || 'An error occurred. Please try again.',
						});
					}
				}
			} finally {
				isInitializingRef.current = false;
				setIsLoading(false);
			}
		};

		initializeUser();
	}, [fetchCompanyDetails, router]);

	const updateCurrentCompany = async (companyId: string | number) => {
		try {
			const newSearchParams = new URLSearchParams(window.location.search);
			newSearchParams.set('company', String(companyId));
			window.history.replaceState({}, '', `?${newSearchParams.toString()}`);
			localStorage.setItem('companyId', String(companyId));
			await fetchCompanyDetails(companyId);
		} catch (error) {
			showErrorToast({
				title: 'Company Switch Failed',
				message: 'Failed to update company context',
			});
		}
	};

	return (
		<UserAuthContext.Provider
			value={{
				user,
				isAuthenticated,
				isLoading,
				login,
				logout,
				updateUser,
				company,
				updateCompany,
				fetchCompanyDetails,
				updateCurrentCompany,
				members,
				setMembers,
			}}
		>
			{children}
		</UserAuthContext.Provider>
	);
};

export const useUserAuth = (): AppTypes.UserAuthContextType => {
	const context = useContext(UserAuthContext);
	if (!context) {
		throw new Error('useUserAuth must be used within a UserAuthProvider');
	}
	return context;
};
