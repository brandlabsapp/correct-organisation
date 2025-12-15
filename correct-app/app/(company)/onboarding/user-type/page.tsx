import { TextCard } from '@/components/common/TextCard';
import { ChevronRight } from 'lucide-react';
import { memo } from 'react';

const USER_ROLES = {
	BUSINESS_OWNER: {
		href: '/onboarding/business-registration?role=owner',
		title: 'Business Owner',
		description:
			'You either own the business or manage it and represent the business.',
		subDescription: 'Director, CEO, Partner, Operational Head',
	},
	CONSULTANT: {
		href: '/onboarding/consultant-profile?role=consultant',
		title: 'Consultant',
		description: 'You support businesses in managing their compliances.',
		subDescription: 'CA, CS, Lawyer, Tax Consultant, Compliance Officer',
	},
} as const;

const RoleCard = memo(
	({
		href,
		title,
		description,
		subDescription,
	}: {
		href: string;
		title: string;
		description: string;
		subDescription: string;
	}) => (
		<TextCard
			href={href}
			title={title}
			description={description}
			subDescription={subDescription}
			background='bg-beige'
			className='cursor-pointer md:min-h-[200px]'
			icon={<ChevronRight className='h-4 w-4 text-gray-600' aria-hidden='true' />}
		/>
	)
);

RoleCard.displayName = 'RoleCard';

export default function UserTypeSelectionPage() {
	return (
		<div className='min-h-screen bg-white'>
			<div className='mx-auto px-4 py-6 sm:px-6 lg:px-8'>
				<header className='mb-8 sm:mb-12'>
					<h1 className='text-heading3 font-semibold text-black mb-2 sm:mb-4'>
						Welcome
					</h1>
					<p className='text-body1 text-black'>
						Let&apos;s get started, select your role
					</p>
				</header>

				<main>
					<div className='grid gap-4 sm:gap-6 md:grid-cols-2 lg:gap-8'>
						<RoleCard
							href={USER_ROLES.BUSINESS_OWNER.href}
							title={USER_ROLES.BUSINESS_OWNER.title}
							description={USER_ROLES.BUSINESS_OWNER.description}
							subDescription={USER_ROLES.BUSINESS_OWNER.subDescription}
						/>
						<RoleCard
							href={USER_ROLES.CONSULTANT.href}
							title={USER_ROLES.CONSULTANT.title}
							description={USER_ROLES.CONSULTANT.description}
							subDescription={USER_ROLES.CONSULTANT.subDescription}
						/>
					</div>
				</main>
			</div>
		</div>
	);
}
