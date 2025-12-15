'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { LearnCard } from '@/components/common/LearnCard';
import { SidebarLayout } from '@/components/common/sidebar-layout';
import { blogs } from '@/data/static/blogs';
import { useState, useMemo } from 'react';

export default function LearnPage() {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	const filteredDocuments = useMemo(() => {
		return blogs.filter((doc) => {
			const searchMatches =
				searchQuery === '' ||
				doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				doc.category.toLowerCase().includes(searchQuery.toLowerCase());
			const tagMatches = selectedTag === null || doc.category === selectedTag;

			return searchMatches && tagMatches;
		});
	}, [searchQuery, selectedTag]);

	const tags = [
		'Labour',
		'Industry Specific',
		'Commercial',
		'Finance & Taxation',
		'EHS',
		'Secretarial',
		'General',
	];

	return (
		<SidebarLayout>
			<div className='p-5 lg:p-8 space-y-5 lg:space-y-6 max-w-7xl mx-auto w-full h-full overflow-y-scroll'>
				<h1 className='text-heading4 font-semibold'>Learn</h1>
				<Input
					type='text'
					placeholder='Search Compliance'
					className='w-full bg-white lg:max-w-2xl'
					icon={<Search className='h-5 w-5 text-gray-400' />}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>

				<div className='flex flex-wrap gap-2.5'>
					{tags.map((tag) => (
						<div
							key={tag}
							className={`rounded-sm py-1.5 px-3 text-body3 border cursor-pointer ${
								selectedTag === tag
									? 'bg-blue-500 text-white border-blue-500'
									: 'bg-blue-light text-gray-600 border-gray-100'
							}`}
							onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
						>
							{tag}
						</div>
					))}
				</div>

				{filteredDocuments.length === 0 ? (
					<div className='text-center py-8 text-gray-500'>
						No matching documents found
					</div>
				) : (
					<div className='grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 pb-10'>
						{filteredDocuments.map((doc) => (
							<LearnCard key={doc.id} {...doc} />
						))}
					</div>
				)}
			</div>
		</SidebarLayout>
	);
}
