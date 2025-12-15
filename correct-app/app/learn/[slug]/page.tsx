import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Markdown from '@/components/common/Markdown';
import { blogs } from '@/data/static/blogs';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;

	const article = {
		title: 'Framework for Ship Leasing',
		description: 'IFSCA Releases Framework for Ship Leasing in GIFT IFSC',
		slug: 'framework-for-ship-leasing',
		publishedAt: 'August 16, 2022',
		updatedAt: 'April 07, 2025',
		category: 'Commercial',
	};

	return {
		title: `${article.title} | Learn`,
		description: article.description,
		openGraph: {
			title: `${article.title} | Learn`,
			description: article.description,
			type: 'article',
			url: `/learn/${article.slug}`,
			publishedTime: article.publishedAt,
		},
	};
}

export default async function ArticlePage({ params }: { params: Params }) {
	const { slug } = await params;
	const articleData: any = blogs.find((blog) => blog.id === parseInt(slug));

	return (
		<div className='flex flex-col min-h-screen bg-gray-100'>
			<div className='p-5 flex justify-between items-center'>
				<Link href='/learn' className='flex items-center text-green-500'>
					<ArrowLeft className='h-4 w-4 mr-1' />
					<span>Back</span>
				</Link>

				<div className='bg-white rounded-md px-3 py-1 text-sm'>
					{articleData.category}
				</div>
			</div>
			<div className='p-5'>
				<Markdown content={articleData.content} />
			</div>
		</div>
	);
}
