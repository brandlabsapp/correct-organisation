import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CSVRow {
	srNo?: string;
	title: string;
	state: string;
	category: string;
	applicability: string;
	purpose: string;
	dueDateRule: string;
	penalties: string;
	section?: string;
	rules?: string;
	startDate?: string;
	endDate?: string;
}

const DataPreviewHeader = ({
	csvData,
	parseInfo,
}: {
	csvData: CSVRow[];
	parseInfo: any;
}) => (
	<div className='flex items-center justify-between'>
		<div className='flex items-center gap-2'>
			<CheckCircle className='h-5 w-5 text-green-600' />
			<span className='font-medium'>Preview Data</span>
			<Badge variant='secondary'>{csvData.length} rows ready to upload</Badge>
			{parseInfo && parseInfo.totalRows !== csvData.length && (
				<Badge variant='outline' className='text-orange-600'>
					{parseInfo.totalRows - csvData.length} rows skipped due to validation
					errors
				</Badge>
			)}
		</div>
	</div>
);
export default DataPreviewHeader;
