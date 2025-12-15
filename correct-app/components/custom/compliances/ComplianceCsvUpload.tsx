'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import Papa from 'papaparse';
import { DataTable } from '@/components/common/DataTable';
import { requiredHeaders, templateData } from '@/utils/constants/constant';
import DataPreviewHeader from './data-preview-header';
import { FileUploadArea } from './FileUploadArea';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { complianceCsvColumns } from './table/compliance-csv-column';

interface CSVUploadDialogProps {
	onUploadComplete?: (count: number) => void;
	onUploadError?: (error: string) => void;
}

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

export default function CSVUploadDialog({
	onUploadComplete,
	onUploadError,
}: CSVUploadDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [csvData, setCsvData] = useState<CSVRow[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<string[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [parseInfo, setParseInfo] = useState<any>(null);
	const uploadInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFile = event.target.files?.[0];
			if (!selectedFile) return;

			setCsvData([]);
			setErrors([]);
			setParseInfo(null);

			if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
				setFile(selectedFile);
				parseCSV(selectedFile);
			} else {
				setErrors(['Please select a valid CSV file']);
				setFile(null);
			}
		},
		[]
	);

	const parseCSV = useCallback(async (file: File) => {
		setIsLoading(true);
		setErrors([]);

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			transformHeader: (header: string) =>
				header
					.toLowerCase()
					.trim()
					.replace(/[^a-z0-9]/g, ''),
			transform: (value: string) => value.trim(),
			complete: (results) => {
				console.log('Papa Parse Results:', {
					data: results.data,
					errors: results.errors,
					meta: results.meta,
				});

				setParseInfo({
					totalRows: results.data.length,
					fields: results.meta.fields,
					errors: results.errors,
					truncated: results.meta.truncated,
				});

				if (results.errors.length > 0) {
					const errorMessages = results.errors.map(
						(error) => `Row ${error.row}: ${error.message}`
					);
					console.warn('⚠️ Papa Parse Errors:', errorMessages);
					setErrors(errorMessages.slice(0, 5));
				}

				const headers = results.meta.fields || [];
				const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

				console.log('📋 Headers analysis:', {
					detectedHeaders: headers,
					requiredHeaders,
					missingHeaders,
				});

				if (missingHeaders.length > 0) {
					setErrors((prev) => [
						...prev,
						`Missing required columns: ${missingHeaders.join(', ')}`,
					]);
					setIsLoading(false);
					return;
				}

				const processedData: CSVRow[] = [];
				const validationErrors: string[] = [];

				results.data.forEach((row: any, index: number) => {
					const processedRow: CSVRow = {
						title: '',
						state: '',
						category: '',
						applicability: '',
						purpose: '',
						dueDateRule: '',
						penalties: '',
						section: '',
					};

					Object.keys(row).forEach((key) => {
						const value = row[key] || '';
						const normalizedKey = key.toLowerCase();

						switch (normalizedKey) {
							case 'srno':
							case 'serialno':
							case 'srnumber':
							case 'serialnumber':
								processedRow.srNo = value;
								break;
							case 'title':
							case 'name':
							case 'formname':
							case 'compliancename':
								processedRow.title = value;
								break;
							case 'state':
								processedRow.state = value;
								break;
							case 'category':
								processedRow.category = value;
								break;
							case 'applicability':
								processedRow.applicability = value;
								break;
							case 'purpose':
								processedRow.purpose = value;
								break;
							case 'duedaterule':
							case 'duedate':
							case 'deadline':
							case 'duedaterules':
								processedRow.dueDateRule = value;
								break;
							case 'penalties':
							case 'penalty':
							case 'fine':
							case 'fines':
								processedRow.penalties = value;
								break;
							case 'section':
								processedRow.section = value;
								break;
							case 'rules':
							case 'rule':
								processedRow.rules = value;
								break;
							case 'startdate':
							case 'effectivedate':
							case 'fromdate':
								processedRow.startDate = value;
								break;
							case 'enddate':
							case 'expirydate':
							case 'todate':
								processedRow.endDate = value;
								break;
						}
					});

					const requiredFields = [
						'title',
						'state',
						'category',
						'applicability',
						'purpose',
						'dueDateRule',
						'penalties',
					];
					const missingFields = requiredFields.filter(
						(field) => !processedRow[field as keyof CSVRow]
					);

					if (missingFields.length > 0) {
						validationErrors.push(
							`Row ${index + 1}: Missing required fields: ${missingFields.join(', ')}`
						);
					} else {
						processedData.push(processedRow);
					}
				});

				if (validationErrors.length > 0) {
					console.warn('⚠️ Data validation errors:', validationErrors);
					setErrors((prev) => [...prev, ...validationErrors.slice(0, 5)]);
				}

				console.log('✅ CSV parsing completed:', {
					totalRowsParsed: processedData.length,
					validationErrors: validationErrors.length,
					sampleData: processedData.slice(0, 2),
				});

				console.log('📊 Complete parsed data for database upload:', processedData);

				setCsvData(processedData);
				setIsLoading(false);
			},
			error: (error) => {
				console.error('❌ Papa Parse Error:', error);
				setErrors([`Failed to parse CSV: ${error.message}`]);
				setIsLoading(false);
			},
		});
	}, []);

	const handleSubmit = async () => {
		if (csvData.length === 0) return;

		console.log('🚀 Starting upload process...');
		console.log('📤 Data being sent to API:', {
			recordCount: csvData.length,
			parseInfo,
			data: csvData,
		});

		setIsUploading(true);
		try {
			const response = await fetch('/api/upload-csv', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					data: csvData,
					meta: {
						fileName: file?.name,
						fileSize: file?.size,
						totalRows: parseInfo?.totalRows,
						processedRows: csvData.length,
					},
				}),
			});

			const result = await response.json();

			console.log('📥 API Response:', {
				status: response.status,
				ok: response.ok,
				result,
			});

			if (response.ok) {
				console.log('✅ Upload successful:', result);
				setIsOpen(false);
				onUploadComplete?.(result.recordsProcessed || csvData.length);
				resetState();
			} else {
				console.error('❌ Upload failed:', result);
				onUploadError?.(result.error || 'Upload failed');
				setErrors([result.error || 'Upload failed']);
			}
		} catch (error) {
			console.error('❌ Network error during upload:', error);
			const errorMessage = 'Upload failed. Please try again.';
			onUploadError?.(errorMessage);
			setErrors([errorMessage]);
		} finally {
			setIsUploading(false);
		}
	};

	const downloadTemplate = () => {
		const csv = Papa.unparse(templateData, {
			header: true,
		});

		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'compliance-forms-template.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);

		console.log('📥 CSV template downloaded using Papa Parse');
	};

	const resetState = () => {
		console.log('🔄 Resetting upload state');
		setFile(null);
		setCsvData([]);
		setErrors([]);
		setParseInfo(null);
		setIsLoading(false);
		setIsUploading(false);

		if (uploadInputRef.current) {
			uploadInputRef.current.value = '';
		}
	};

	const handleCancel = () => {
		console.log('❌ Upload cancelled by user');
		setIsOpen(false);
		resetState();
	};

	const handleRemoveFile = (e: React.MouseEvent) => {
		e.stopPropagation();
		console.log('🗑️ File removed by user');
		setFile(null);
		setCsvData([]);
		setErrors([]);
		setParseInfo(null);

		if (uploadInputRef.current) {
			uploadInputRef.current.value = '';
		}
	};

	const handleUploadAreaClick = () => {
		if (!file) {
			if (uploadInputRef.current) {
				uploadInputRef.current.click();
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant='outline' className='gap-2'>
					<Upload className='h-4 w-4' />
					Upload CSV
				</Button>
			</DialogTrigger>
			<DialogContent className='max-w-4xl w-[90vw] max-h-[85vh] overflow-hidden flex flex-col bg-white'>
				<DialogHeader>
					<DialogTitle>Upload CSV File</DialogTitle>
					<DialogDescription className='space-y-2'>
						<div>Upload a CSV file containing compliance form data.</div>
						<div className='text-sm'>
							<strong>Required columns:</strong> title, state, category, applicability,
							purpose, dueDateRule, penalties
						</div>
						<Button
							variant='link'
							onClick={downloadTemplate}
							className='h-auto p-0 text-sm'
						>
							<Download className='h-3 w-3 mr-1' />
							Download CSV Template
						</Button>
					</DialogDescription>
				</DialogHeader>

				<div className='flex-1 overflow-y-auto pr-1'>
					<div className='space-y-4'>
						<FileUploadArea
							file={file}
							parseInfo={parseInfo}
							onClick={handleUploadAreaClick}
							onRemove={handleRemoveFile}
							onChange={handleFileChange}
							uploadInputRef={uploadInputRef}
						/>

						{errors.length > 0 && <ErrorDisplay errors={errors} />}

						{isLoading && <LoadingSpinner />}

						{csvData.length > 0 && (
							<div className='space-y-4'>
								<DataPreviewHeader csvData={csvData} parseInfo={parseInfo} />

								<div className='border rounded-md overflow-hidden'>
									<DataTable columns={complianceCsvColumns} data={csvData} />
								</div>
							</div>
						)}
					</div>
				</div>

				<DialogFooter className='pt-4 border-t mt-4'>
					<Button variant='outline' onClick={handleCancel} disabled={isUploading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={csvData.length === 0 || errors.length > 0 || isUploading}
					>
						{isUploading ? 'Uploading...' : `Submit ${csvData.length} Records`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
