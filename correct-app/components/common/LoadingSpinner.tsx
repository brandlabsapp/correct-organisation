export const LoadingSpinner = () => (
	<div className='text-center py-4'>
		<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto'></div>
		<p className='mt-2 text-sm text-gray-600'>Parsing CSV with Papa Parse...</p>
	</div>
);
