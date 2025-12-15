'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUserAuth } from '@/contexts/user';
import { useSearchParams } from 'next/navigation';
import CompanySelect from '@/components/profile/CompanySelect';

const profileSections = [
	{
		id: 'personal-details',
		title: 'Personal Details',
		description: 'Your personal information',
		path: '/profile/personal-details',
	},
	{
		id: 'company-details',
		title: 'Company Details',
		description: 'Your company information',
		path: '/profile/company-details',
	},
	{
		id: 'manage-team',
		title: 'Manage Team',
		description: 'Team members and roles',
		path: '/profile/manage-team',
	},

	{
		id: 'help-support',
		title: 'Help & Support',
		description: 'Send your queries to us',
		path: '/profile/help-support',
	},
	{
		id: 'logout',
		title: 'Logout',
		description: 'Sign out from Correct',
		path: '/profile/logout',
	},
];

export default function ProfilePage() {
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const { user } = useUserAuth();
	const totalCompanies = [
		...(user?.companyMembers?.map((member) => member.company) || []),
		...(user?.companyDetails || []),
	];
	return (
		<ScrollArea className='h-full overflow-y-scroll'>
			<CompanySelect totalCompanies={totalCompanies} />
			<div className='md:space-y-8 md:py-10 space-y-4 py-5'>
				{profileSections.map((section) => (
					<div key={section.id}>
						{section.id === 'logout' && (
							<div className='w-full h-px bg-gray-200 my-2'></div>
						)}
						<Link
							href={`${section.path}?company=${companyId}`}
							className='block w-full'
						>
							<Button
								variant='outline'
								className='w-full justify-between border border-lightgray bg-lightgray rounded-xl h-16 md:h-20 py-4 md:py-5'
							>
								<div className='flex flex-col items-start'>
									<span
										className={`font-medium text-body2 md:text-body1 ${
											section.id === 'logout' ? 'text-red-light' : 'text-black'
										}`}
									>
										{section.title}
									</span>
									{section.description && (
										<span className='text-muted-foreground text-body3 md:text-body2'>
											{section.description}
										</span>
									)}
								</div>
								<ChevronRight className='h-4 w-4 md:h-10 md:w-10' />
							</Button>
						</Link>
					</div>
				))}
			</div>
		</ScrollArea>
	);
}
