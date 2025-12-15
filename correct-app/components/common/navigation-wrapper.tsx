'use client';

import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';

export function NavigationWrapper() {
	return (
		<>
			<Sidebar />
			<BottomNav />
		</>
	);
}
