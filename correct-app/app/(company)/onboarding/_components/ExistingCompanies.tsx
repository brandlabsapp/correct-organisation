'use client';

import { useRouter } from 'next/navigation';
import { Building2, ChevronRight, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useUserAuth } from '@/contexts/user';
// Replaced moment with date-fns for smaller bundle size
import { format } from 'date-fns';
import { showErrorToast } from '@/lib/utils/toast-handlers';

interface Company {
	id: string;
	name: string;
	role: string;
	lastAccessedAt?: string;
	company?: any;
}

export default function ExistingCompanies({
	companies,
}: {
	companies: Company[];
}) {
	const router = useRouter();
	const { user, fetchCompanyDetails } = useUserAuth();

	const updateLastAccessedAt = async (companyId: number) => {
		const response = await fetch(
			`/api/onboarding/existing-companies/${user?.id}`,
			{
				method: 'PATCH',
				body: JSON.stringify({
					lastAccessedAt: new Date().toISOString(),
					companyId,
				}),
			}
		);
		const data = await response.json();
		if (data.state === 'error') {
			return showErrorToast({
				error: data,
			});
		}
		return 1;
	};

	const handleCompanySelect = async (companyId: string) => {
		await fetchCompanyDetails(companyId);
		router.push(`/dashboard?company=${companyId}`);
		const res = await updateLastAccessedAt(parseInt(companyId));
		console.log(res);
	};

	const handleCreateNew = () => {
		router.push('/onboarding/user-type');
	};

	return (
		<div className='flex min-h-screen md:h-[calc(100vh-3.7rem)] bg-white justify-center p-5'>
			<div className='w-full max-w-4xl mx-auto'>
				<Card className='w-full bg-white md:shadow-md shadow-none'>
					<CardHeader className='space-y-2 p-4 md:p-6'>
						<CardTitle className='text-xl md:text-2xl font-bold'>
							Select a Company
						</CardTitle>
						<CardDescription>
							Choose an existing company or create a new one
						</CardDescription>
					</CardHeader>
					<ScrollArea className='h-1/2 overflow-y-auto md:h-[400px] px-4 md:px-5 bg-white'>
						<div className='space-y-3 md:space-y-4'>
							{companies?.map((company) => (
								<div key={company.id}>
									<Button
										variant='ghost'
										className='relative flex w-full items-center justify-start space-x-2 md:space-x-4 px-3 md:px-4 py-6 md:py-10 hover:bg-gray-100'
										onClick={() => handleCompanySelect(company.company?.id)}
									>
										<div className='flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10'>
											<Building2 className='h-5 w-5 md:h-6 md:w-6 text-gray-500' />
										</div>
										<div className='flex-1 space-y-0.5 md:space-y-1 text-left'>
											<p className='text-sm md:text-base font-medium leading-none text-prewrap'>
												{company.company?.name}
											</p>
											<p className='text-xs md:text-sm text-muted-foreground'>
												{company.role}
											</p>
											{company.lastAccessedAt && (
												<p className='text-xs text-muted-foreground hidden md:block'>
												Last accessed {format(new Date(company.lastAccessedAt), 'PPPP')} {/* date-fns format */}
											</p>
											)}
										</div>
										<ChevronRight className='h-4 w-4 md:h-5 md:w-5 text-muted-foreground' />
									</Button>
									<Separator className='mt-3 md:mt-4' />
								</div>
							))}
						</div>
					</ScrollArea>
					<div className='p-4 md:p-6 pt-3 md:pt-4'>
						<Button
							variant='lightgray'
							className='flex w-full items-center justify-center space-x-2 mt-3'
							onClick={handleCreateNew}
						>
							<PlusCircle className='h-4 w-4 md:h-5 md:w-5' />
							<span className='text-sm md:text-base'>Create New Company</span>
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}
