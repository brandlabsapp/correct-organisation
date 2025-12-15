import { createContext, useContext, useState } from 'react';

export const AdminContext = createContext<AppTypes.AdminAuthContextType | null>(
	null
);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [admin, setAdmin] = useState<AppTypes.Admin | null>(null);

	const login = (adminData: AppTypes.Admin) => {
		setAdmin(adminData);
	};

	const logout = () => {
		setAdmin(null);
	};

	const updateAdmin = (adminData: AppTypes.Admin) => setAdmin(adminData);

	return (
		<AdminContext.Provider value={{ admin, login, logout, updateAdmin }}>
			{children}
		</AdminContext.Provider>
	);
};

export const useAdminContext = () => {
	const context = useContext(AdminContext);
	if (!context) {
		throw new Error('useAdminAuth must be used within an AdminProvider');
	}
	return context;
};
