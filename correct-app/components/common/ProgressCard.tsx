import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
	title: string;
	value: string;
	description: string;
	icon: React.ReactNode;
	progressValue?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
	title,
	value,
	description,
	icon,
	progressValue,
}) => {
	return (
		<Card className='bg-lightgray p-5'>
			<CardHeader className='flex flex-row items-center justify-between bg-lightgray space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold text-black'>{value}</div>
				<p className='text-xs text-muted-foreground'>{description}</p>
				{progressValue !== undefined && (
					<Progress value={progressValue} className='mt-2' />
				)}
			</CardContent>
		</Card>
	);
};
