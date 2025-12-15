'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BottomNav } from '@/components/common/bottom-nav';
import { DataTable } from '@/components/common/DataTable';
import { AddFormDialog } from '@/components/custom/compliances/AddFormDialog';
import {
	columns as complianceColumns,
	CompanyForm,
} from '@/components/custom/compliances/table/column';
import {
	Company,
	companyColumns,
} from '@/components/custom/compliances/table/companyColumn';
import { useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import ComplianceCsvUpload from '@/components/custom/compliances/ComplianceCsvUpload';
import { SearchIcon } from 'lucide-react';

function ComplianceTabsContent({
	initialComplianceData,
	initialCompanyData,
}: {
	initialComplianceData: CompanyForm[];
	initialCompanyData: Company[];
}) {
	const [complianceData, setComplianceData] = useState<CompanyForm[]>(
		initialComplianceData
	);

	const handleAddCompliance = (newForm: CompanyForm) => {
		setComplianceData([...complianceData, newForm]);
	};

	const handleSearch = useCallback(
		(search: string) => {
			if (!search.trim()) {
				setComplianceData(initialComplianceData);
				return;
			}

			const filteredData = initialComplianceData.filter((item) =>
				Object.entries(item).some(([key, value]) =>
					value?.toString().toLowerCase().includes(search.toLowerCase())
				)
			);
			setComplianceData(filteredData);
		},
		[initialComplianceData]
	);

	return (
		<div className='bg-white min-h-screen'>
			<div className='px-10 py-10'>
				<Tabs defaultValue='compliances' className='w-full'>
					<div className='mb-4 flex justify-between items-center gap-x-5'>
						<TabsList>
							<TabsTrigger value='compliances'>Compliances</TabsTrigger>
							<TabsTrigger value='companies'>Companies</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value='compliances'>
						<div className='mb-4 flex gap-x-5'>
							<AddFormDialog
								onAddForm={handleAddCompliance}
								serialNo={complianceData.length + 1}
							/>
							<Input
								type='text'
								placeholder='Search'
								width='full'
								icon={<SearchIcon />}
								onChange={(e) => handleSearch(e.target.value)}
							/>
							<ComplianceCsvUpload />
						</div>
						<DataTable columns={complianceColumns} data={complianceData} />
					</TabsContent>

					<TabsContent value='companies'>
						<DataTable columns={companyColumns} data={initialCompanyData} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

export default function ComplianceTabs({
	initialComplianceData,
	initialCompanyData,
}: {
	initialComplianceData?: CompanyForm[];
	initialCompanyData?: any[];
}) {
	return (
		<ComplianceTabsContent
			initialComplianceData={initialComplianceData || []}
			initialCompanyData={initialCompanyData || []}
		/>
	);
}
