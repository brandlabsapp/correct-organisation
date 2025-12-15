import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';

type StatusType = 'success' | 'error' | 'warning' | 'info';

interface StatusModalProps {
	title: string;
	message: string;
	status: StatusType;
	buttonText: string;
	onButtonClick: () => void;
	open: boolean;
	setOpen: (open: boolean) => void;
}
interface StatusConfig {
	titleColor: string;
	variant: 'default' | 'lightRed' | 'red';
	iconSrc: string;
}

const StatusModal = ({
	title,
	message,
	status = 'success',
	buttonText,
	onButtonClick,
	open,
	setOpen,
}: StatusModalProps) => {
	const statusConfig: Record<StatusType, StatusConfig> = {
		success: {
			titleColor: 'text-black',
			variant: 'default',
			iconSrc: '/assets/icons/sucess.svg',
		},
		error: {
			titleColor: 'text-black',
			variant: 'lightRed',
			iconSrc: '/assets/icons/error.svg',
		},
		warning: {
			titleColor: 'text-black',
			variant: 'default',
			iconSrc: '/assets/icons/review.svg',
		},
		info: {
			titleColor: 'text-black',
			variant: 'default',
			iconSrc: '/assets/icons/check.svg',
		},
	};

	const config = statusConfig[status];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='bg-white max-w-[350px] rounded-lg'>
				<div className='flex flex-col space-y-3 items-center justify-center'>
					<div className='bg-white rounded-lg w-full max-w-md flex flex-col items-center space-y-4'>
						<div className='w-20 h-20 relative'>
							<Image src={config.iconSrc} alt={status} fill priority />
						</div>
					</div>

					<h3 className={`text-xl font-semibold ${config.titleColor} text-center`}>
						{title}
					</h3>

					<p className='text-secondarygray-dark text-center'>{message}</p>
				</div>
				<Button variant={config.variant} onClick={onButtonClick}>
					{buttonText}
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default StatusModal;
