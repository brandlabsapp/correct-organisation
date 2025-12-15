import Image from 'next/image';
import Link from 'next/link';

interface LearnCardProps {
	id?: number;
	title: string;
	category: string;
	publishedDate: string;
	imageUrl: string;
}

export function LearnCard({
	id = 1,
	title,
	category,
	publishedDate,
	imageUrl,
}: LearnCardProps) {
	return (
		<Link href={`/learn/${id}`} className='flex flex-col w-full'>
			<div className='overflow-hidden rounded-t-xl bg-white'>
				<div className='relative w-full h-[160px] md:h-[200px] lg:h-[240px] xl:h-[260px]'>
					<Image
						src={imageUrl || '/placeholder.svg'}
						alt={title}
						fill
						loading='lazy'
						className='object-cover rounded'
					/>
				</div>
			</div>
			<div className='flex flex-col bg-lightgray px-3 py-2 lg:px-4 lg:py-3 rounded-b-xl grow'>
				<h3 className='text-body3 lg:text-body2 font-semibold mb-3 line-clamp-2'>
					{title}
				</h3>
				<div className='flex justify-between items-center text-body4 lg:text-body3 text-secondarygray-dark'>
					<span className='bg-white px-3 py-1 rounded-full'>{category}</span>
					<span className='text-body4 lg:text-body3 text-secondarygray-dark'>
						{publishedDate}
					</span>
				</div>
			</div>
		</Link>
	);
}
