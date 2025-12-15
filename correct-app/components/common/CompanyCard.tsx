import { cn } from '@/lib/utils';
import React from 'react';
import { useRouter } from 'next/navigation';
type Props = {
	company: AppTypes.Company;
	setSelectedCompany: (company: AppTypes.Company) => void;
	className?: string;
};

const CompanyCard = ({ company, setSelectedCompany, className }: Props) => {
	const router = useRouter();
	const handleSwitchCompany = () => {
		setSelectedCompany(company);
		router.push(`/profile?company=${company.id}`);
	};
	return (
		<div
			className={cn(
				'flex items-center gap-2 cursor-pointer py-3 px-4 rounded-lg bg-lightgray',
				className
			)}
			key={company.id}
			onClick={handleSwitchCompany}
		>
			<div className='h-6 w-6 rounded-full bg-gray-dark flex items-center justify-center'>
				<p className='text-body3 font-medium text-white'>
					{company?.name?.charAt(0)}
				</p>
			</div>
			<p className='text-body3 font-medium text-gray-700'>{company?.name}</p>
		</div>
	);
};

export default CompanyCard;
