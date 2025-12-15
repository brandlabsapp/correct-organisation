'use client';
import { SidebarLayout } from '@/components/common/sidebar-layout';
import { ChecklistCard } from '@/components/checklist/checklist-card';
import { TaskCard } from '@/components/checklist/task-card';
import { Section } from '@/components/checklist/section';

export default function Dashboard({
	data,
	companyId,
}: {
	data: any;
	companyId: string;
}) {
	console.log(data);
	return (
		<SidebarLayout>
			<div className='h-full overflow-y-scroll'>
				<div className='flex justify-between items-center mb-5 p-3'>
					<h4 className='text-heading4 font-bold text-gray-800'>Home</h4>
				</div>
				<main className='px-4'>
					<Section
						title='Upcoming Compliances'
						linkText='View all'
						linkHref={`/all-compliances?company=${companyId}`}
					>
						{data?.map((item: dashboard.IChecklistCard) => (
							<ChecklistCard
								key={item.compliance.id}
								title={item.compliance.title}
								type={item.compliance.category}
								timeframe={item.compliance.dueDateRule}
								href={`/all-compliances/${item.compliance.id}?company=${companyId}`}
							/>
						))}
					</Section>

					<Section title='Essential tasks' linkText='View all' linkHref='#'>
						{data[0]?.companyComplianceTasks?.map((item: dashboard.ITaskCard) => (
							<TaskCard
								key={item.id}
								title={item?.task?.title}
								timeframe={item?.task?.deadline}
							/>
						))}
					</Section>
				</main>
			</div>
		</SidebarLayout>
	);
}
