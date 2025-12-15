import { HelpSupport } from '@/components/profile/help-support';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HelpSupportPage() {
	return (
		<div className='py-4'>
			<ScrollArea className='h-[calc(100vh-12rem)]'>
				<HelpSupport />
			</ScrollArea>
		</div>
	);
}
