'use client';

import { useState } from 'react';
import { Check, ChevronDown, Building, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useUserAuth } from '@/contexts/user';

type Company = {
	id: number;
	name: string;
	industry: string;
};

export default function CompanySwitcher({ data }: { data: Company[] }) {
	const { company, updateCurrentCompany } = useUserAuth();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	// Sync with context company
	const [selectedCompany, setSelectedCompany] = useState<Company>(
		data.find((c) => c.id === company?.id) || data[0]
	);

	const handleCompanyChange = async (companyId: number) => {
		const newCompany = data.find((c) => c.id === companyId);
		if (newCompany) {
			setSelectedCompany(newCompany);
			await updateCurrentCompany(companyId);
			router.refresh();
		}
	};

	return (
		<div className='flex items-center space-x-4'>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						aria-label='Select a company'
						className='w-full justify-between'
					>
						<div className='flex items-center gap-2 truncate'>
							<Building className='h-4 w-4 shrink-0 opacity-70' />
							<span className='truncate'>{selectedCompany.name}</span>
						</div>
						<ChevronDown className='ml-auto h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[300px] p-0'>
					<Command>
						<CommandInput placeholder='Search company...' />
						<CommandList>
							<CommandEmpty>No company found.</CommandEmpty>
							<CommandGroup heading='Your Companies'>
								{data.map((company) => (
									<CommandItem
										key={company.id}
										onSelect={() => {
											handleCompanyChange(company.id);
											setOpen(false);
										}}
										className='text-sm'
									>
										<Building className='mr-2 h-4 w-4' />
										<span className='flex-1 truncate'>{company.name}</span>
										<span className='text-xs text-muted-foreground'>
											{company.industry}
										</span>
										<Check
											className={cn(
												'ml-2 h-4 w-4',
												selectedCompany.id === company.id ? 'opacity-100' : 'opacity-0'
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setOpen(false);
									}}
								>
									<Plus className='mr-2 h-4 w-4' />
									Add New Company
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
