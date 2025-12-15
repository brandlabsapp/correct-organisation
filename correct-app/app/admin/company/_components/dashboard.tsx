'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from './overview';
import { TeamMembers } from './members';
import { Documents } from './documents';
import { Compliances } from './compliances';

export default function Dashboard({
	companyData,
	members,
	checklist,
	documents,
	folders,
	allCompliances,
	companyId,
}: {
	companyData: any;
	members: any;
	checklist: any;
	documents: any;
	folders: any;
	allCompliances: any;
	companyId: string | null;
}) {
	return (
		<div className='mx-auto p-5 md:p-6'>
			<h1 className='text-xl md:text-3xl font-bold mb-6'>
				{companyData?.name} Dashboard
			</h1>
			<Tabs defaultValue='overview' className='w-full'>
				<TabsList className='grid w-full grid-cols-4 gap-3'>
					<TabsTrigger value='overview' className='text-sm md:text-base '>
						Overview
					</TabsTrigger>
					<TabsTrigger value='team' className='text-sm md:text-base '>
						Team Members
					</TabsTrigger>
					<TabsTrigger value='documents' className='text-sm md:text-base '>
						Documents
					</TabsTrigger>
					<TabsTrigger value='compliances' className='text-sm md:text-base '>
						Compliances
					</TabsTrigger>
				</TabsList>
				<TabsContent value='overview'>
					<Overview companyData={companyData} />
				</TabsContent>
				<TabsContent value='team'>
					<TeamMembers members={members} />
				</TabsContent>
				<TabsContent value='documents'>
					<Documents document={documents} folder={folders} />
				</TabsContent>
				<TabsContent value='compliances'>
					<Compliances
						companyId={companyId}
						checklist={checklist}
						allCompliances={allCompliances}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
