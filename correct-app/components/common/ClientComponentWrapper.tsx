'use client';

import { Suspense, ComponentType } from 'react';

interface WrapperProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function ClientComponentWrapper({
	children,
	fallback = <div>Loading...</div>,
}: WrapperProps) {
	return <Suspense fallback={fallback}>{children}</Suspense>;
}

export function withClientWrapper<P extends object>(
	Component: ComponentType<P>,
	fallback?: React.ReactNode
) {
	return function WrappedComponent(props: P) {
		return (
			<ClientComponentWrapper fallback={fallback}>
				<Component {...props} />
			</ClientComponentWrapper>
		);
	};
}
