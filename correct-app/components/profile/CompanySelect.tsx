import React from 'react';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { PlusIcon } from 'lucide-react';
import CompanyCard from '../common/CompanyCard';
import { useUserAuth } from '@/contexts/user';

export type CompanySelectProps = {
	totalCompanies: AppTypes.Company[];
	/** Company to show in the trigger (e.g. from URL). Falls back to context company. */
	displayCompany?: AppTypes.Company | null;
};

const CompanySelectDialog = ({ totalCompanies, displayCompany }: CompanySelectProps) => {
	const { company, updateCompany } = useUserAuth();
	const companyToShow = displayCompany ?? company;
	return (
		<div className='w-full'>
			<Dialog>
				<DialogTrigger className='w-full'>
					<div className='w-full bg-blue rounded-lg p-1 min-h-[2.25rem] flex items-center'>
						{companyToShow?.name ? (
							<CompanyCard
								company={companyToShow}
								setSelectedCompany={updateCompany}
								className='cursor-pointer bg-transparent p-1'
							/>
						) : (
							<p className='text-sm font-medium text-gray-700'>{'Select Company'}</p>
						)}
					</div>
				</DialogTrigger>
				<DialogContent className='w-full bg-white max-h-[500px] max-w-[330px] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Select Company</DialogTitle>
					</DialogHeader>
					{totalCompanies.map((company) => (
						<CompanyCard
							key={company.id}
							company={company}
							setSelectedCompany={updateCompany}
						/>
					))}
					<Button className='w-full flex items-center gap-2' variant='lightgray'>
						<PlusIcon className='w-4 h-4 text-black font-bold bg-blue-dark rounded-full p-1' />
						Add New Company
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default CompanySelectDialog;
