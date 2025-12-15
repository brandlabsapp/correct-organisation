import { PersonalDetails } from '@/components/profile/personal-details';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PersonalDetailsPage() {
	return (
		<div className='py-4'>
			<ScrollArea className='h-[calc(100vh-12rem)]'>
				<PersonalDetails />
			</ScrollArea>
		</div>
	);
}
