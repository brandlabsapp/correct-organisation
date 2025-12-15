'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';

interface SidebarContextType {
	isCollapsed: boolean;
	setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
		if (typeof window === 'undefined') return false;
		try {
			const stored = window.localStorage.getItem('sidebar-collapsed');
			return stored ? stored === 'true' : false;
		} catch {
			return false;
		}
	});

	useEffect(() => {
		try {
			window.localStorage.setItem('sidebar-collapsed', String(isCollapsed));
		} catch {}
	}, [isCollapsed]);

	return (
		<SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (context === undefined) {
		throw new Error('useSidebar must be used within a SidebarProvider');
	}
	return context;
}
