import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const ErrorDisplay = ({ errors }: { errors: string[] }) => (
	<Alert variant='destructive'>
		<AlertCircle className='h-4 w-4' />
		<AlertDescription>
			<ul className='list-disc list-inside space-y-1'>
				{errors.map((error, index) => (
					<li key={index}>{error}</li>
				))}
			</ul>
		</AlertDescription>
	</Alert>
);
