import { ManageTeam } from '@/components/profile/manage-team';
import { ScrollArea } from '@/components/ui/scroll-area';
import { redirect } from 'next/navigation';

export default async function ManageTeamPage(props: {
	searchParams: Promise<{ company: string }>;
}) {
	const searchParams = await props.searchParams;
	if (!searchParams.company) {
		return redirect('/profile');
	}

	return (
		<div className='py-4'>
			<ScrollArea className='max-h-[calc(100vh-14rem)] overflow-y-scroll'>
				<ManageTeam />
			</ScrollArea>
		</div>
	);
}
