import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FileText } from 'lucide-react';

export const FileUploadArea = ({
	file,
	parseInfo,
	onClick,
	onRemove,
	onChange,
	uploadInputRef,
}: {
	file: File | null;
	parseInfo: any;
	onClick: () => void;
	onRemove: (e: React.MouseEvent) => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	uploadInputRef: React.RefObject<HTMLInputElement | null>;
}) => {
	return (
		<div
			className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
				file
					? 'border-green-300 bg-green-50'
					: 'border-gray-300 hover:border-gray-400 cursor-pointer'
			}`}
			onClick={onClick}
		>
			{file && (
				<Button
					variant='ghost'
					size='sm'
					className='absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-red-100'
					onClick={onRemove}
				>
					<X className='h-4 w-4 text-red-500' />
					<span className='sr-only'>Remove file</span>
				</Button>
			)}

			<div className='text-center'>
				<FileText
					className={`mx-auto h-12 w-12 ${
						file ? 'text-green-500' : 'text-gray-400'
					}`}
				/>
				<div className='mt-4'>
					{file ? (
						<div className='space-y-2'>
							<span
								className='text-sm font-medium text-gray-900 block truncate max-w-[300px] mx-auto'
								title={file.name}
							>
								{file.name}
							</span>
							<span className='text-xs text-gray-500 block'>
								{(file.size / 1024).toFixed(1)} KB • Click X to remove
							</span>
							{parseInfo && (
								<div className='text-xs text-blue-600 space-y-1'>
									<div>Detected {parseInfo.totalRows} rows</div>
									{parseInfo.fields && <div>Columns: {parseInfo.fields.join(', ')}</div>}
								</div>
							)}
						</div>
					) : (
						<div>
							<span className='mt-2 block text-sm font-medium text-gray-900'>
								Choose CSV file or drag and drop
							</span>
							<span className='text-xs text-gray-500 mt-1 block'>
								Supports .csv files up to 10MB
							</span>
							<input
								id='csv-upload'
								type='file'
								accept='.csv'
								onChange={onChange}
								className='hidden'
								ref={uploadInputRef}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
