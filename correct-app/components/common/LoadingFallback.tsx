import { Loader2 } from 'lucide-react';
export function LoadingFallback() {
	return (
		<div className='flex h-screen w-screen items-center justify-center bg-white'>
			<Loader2 className='animate-spin rounded-full h-8 w-8' />
		</div>
	);
}
