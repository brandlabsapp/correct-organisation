import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

const Markdown = ({ content }: { content: string }) => {
	return (
		<ReactMarkdown
			components={{
				h1: ({ children }) => (
					<h1 className='text-mobile-heading1 md:text-heading1 font-bold mb-6 mt-8'>
						{children}
					</h1>
				),
				h2: ({ children }) => (
					<h2 className='text-mobile-heading2 md:text-heading2 font-bold mb-5 mt-8'>
						{children}
					</h2>
				),
				h3: ({ children }) => (
					<h3 className='text-mobile-heading3 md:text-heading3 font-bold mb-4 mt-6'>
						{children}
					</h3>
				),
				h4: ({ children }) => (
					<h4 className='text-mobile-heading4 md:text-heading4 font-bold mb-3 mt-5'>
						{children}
					</h4>
				),
				h5: ({ children }) => (
					<h5 className='text-mobile-heading5 md:text-heading5 font-bold mb-3 mt-4'>
						{children}
					</h5>
				),
				p: ({ children }) => <p className='text-body1 mb-4'>{children}</p>,
				ul: ({ children }) => (
					<ul className='list-disc pl-8 mb-6 space-y-2'>{children}</ul>
				),
				ol: ({ children }) => (
					<ol className='list-decimal pl-8 mb-6 space-y-2'>{children}</ol>
				),
				li: ({ children }) => <li className='mb-1'>{children}</li>,
				strong: ({ children }) => <span className='font-bold'>{children}</span>,
				em: ({ children }) => <span className='italic'>{children}</span>,
				code: ({ children }) => (
					<code className='bg-gray-100 px-1 py-0.5 rounded font-mono text-sm'>
						{children}
					</code>
				),
				img: ({ src, alt }) => (
					<div className='my-6'>
						<Image
							src={src as string}
							loading='lazy'
							alt={alt as string}
							width={700}
							height={400}
							className='rounded-lg w-full object-cover'
						/>
					</div>
				),
				blockquote: ({ children }) => (
					<blockquote className='border-l-4 border-gray-300 pl-4 italic my-6'>
						{children}
					</blockquote>
				),
				hr: () => <hr className='my-8 border-t border-gray-200' />,
				a: ({ href, children }) => (
					<a
						href={href}
						className='text-blue-600 hover:underline'
						target='_blank'
						rel='noopener noreferrer'
					>
						{children}
					</a>
				),
			}}
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeRaw]}
		>
			{content.trim()}
		</ReactMarkdown>
	);
};
export default Markdown;
