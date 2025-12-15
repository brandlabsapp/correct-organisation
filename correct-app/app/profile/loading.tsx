const Skeleton = () => {
	return (
		<div className='space-y-4 py-5 animate-pulse'>
			<div>
				<div className='w-full h-px bg-gray-200 my-2' />
				<div className='block w-full'>
					<div className='w-full justify-between border border-lightgray bg-lightgray rounded-xl h-16 py-4'>
						<div className='flex flex-col items-start'>
							<div className='h-4 bg-gray-200 rounded w-1/2' />
							<div className='mt-1 h-4 bg-gray-200 rounded w-full' />
						</div>
						<div className='h-4 w-4 bg-gray-200 rounded' />
					</div>
				</div>
			</div>
		</div>
	);
};

export default function ProfileLoading() {
	return (
		<div className='space-y-4 py-5'>
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className='w-full'>
					<Skeleton />
				</div>
			))}
		</div>
	);
}
