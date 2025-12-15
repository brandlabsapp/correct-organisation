import { Loader2 } from 'lucide-react';
export function LoadingFallback() {
	return (
		<div className='flex justify-center items-center h-screen'>
			<Loader2 className='animate-spin rounded-full h-8 w-8' />
		</div>
	);
}
