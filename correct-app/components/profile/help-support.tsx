'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { ChevronRight, Phone, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export function HelpSupport() {
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement actual support ticket submission
		toast({
			title: 'Message submitted',
			description: "We'll get back to you as soon as possible.",
		});
		setName('');
		setMessage('');
	};

	const faqs = [
		{
			question: 'How do I update my company information?',
			answer:
				"You can update your company information in the 'Company Details' section of your profile. Click on the 'Company Details' button and edit the necessary fields.",
		},
		{
			question: 'What should I do if I miss a compliance deadline?',
			answer:
				"If you miss a compliance deadline, contact our support team immediately. We'll guide you through the necessary steps to rectify the situation and minimize any potential consequences.",
		},
		{
			question: 'How often are compliance requirements updated?',
			answer:
				'We update our compliance requirements database daily. However, major changes are typically communicated to users via email and in-app notifications.',
		},
	];

	return (
		// <ScrollArea className='h-full'>
		<div className='flex flex-col space-y-4'>
			<Link href='/profile' className='flex items-center gap-1 text-green mb-2'>
				<ChevronRight className='w-5 h-5 rotate-180' />
				<span>Back</span>
			</Link>

			<div className='bg-lightgray rounded-lg p-4 flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className='bg-secondarygray-dark p-2 rounded-full'>
						<Phone className='w-5 h-5 text-white' />
					</div>
					<span className='font-medium'>Contact Customer Care</span>
				</div>
				<ChevronRight className='w-5 h-5' />
			</div>

			<Accordion type='single' collapsible className='w-full'>
				<AccordionItem value='faqs-item' className='border-none'>
					<div className='bg-lightgray rounded-lg'>
						<AccordionTrigger className='p-4 flex items-center justify-between hover:no-underline'>
							<div className='flex items-center gap-3'>
								<div className='bg-secondarygray-dark p-2 rounded-full'>
									<HelpCircle className='w-5 h-5 text-white' />
								</div>
								<span className='font-medium'>Read FAQs</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<div className='p-4 pt-2'>
								{faqs.map((faq, index) => (
									<div key={index} className='py-3 border-b last:border-0'>
										<h4 className='font-medium mb-2'>{faq.question}</h4>
										<p className='text-secondarygray-dark text-sm'>{faq.answer}</p>
									</div>
								))}
							</div>
						</AccordionContent>
					</div>
				</AccordionItem>
			</Accordion>

			<div className='space-y-4 mt-8'>
				<div className='space-y-2'>
					<label htmlFor='name' className='text-sm font-medium'>
						Name
					</label>
					<Input
						id='name'
						placeholder='Harsh Vitra'
						value={name}
						onChange={(e) => setName(e.target.value)}
						className='text-sm md:text-base w-full'
						required
					/>
				</div>
				<div className='space-y-2'>
					<label htmlFor='message' className='text-sm font-medium'>
						Message
					</label>
					<Textarea
						id='message'
						placeholder='Message here'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className='text-sm md:text-base min-h-[100px]'
						required
					/>
				</div>
				<Button
					type='submit'
					className='w-full bg-black text-white rounded-md py-4'
					onClick={handleSubmit}
				>
					Submit Message
				</Button>
			</div>
		</div>
		// </ScrollArea>
	);
}
