'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';

interface TaxRate {
	id: string;
	name: string;
	rate: number;
	isDefault: boolean;
}

interface SavedItem {
	id: string;
	name: string;
	description: string;
	rate: number;
	itemType: string;
	sacCode: string;
}

export function FinanceSettingsPage() {
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [loading, setLoading] = useState(false);
	const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
	const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

	const [settings, setSettings] = useState({
		defaultCurrency: 'INR',
		defaultPaymentTerms: 30,
		enableGst: true,
		defaultGstRate: 18,
		defaultInvoiceNotes: '',
		defaultInvoiceFooter: '',
		bankName: '',
		bankAccountName: '',
		bankAccountNumber: '',
		bankIfscCode: '',
	});

	const [newTaxRate, setNewTaxRate] = useState({ name: '', rate: 0 });
	const [newSavedItem, setNewSavedItem] = useState({
		name: '',
		description: '',
		rate: 0,
		itemType: 'service',
		sacCode: '',
	});

	useEffect(() => {
		if (companyId) {
			fetchSettings();
			fetchTaxRates();
			fetchSavedItems();
		}
	}, [companyId]);

	const fetchSettings = async () => {
		try {
			const response = await fetch(`/api/finance/settings?company=${companyId}`);
			if (response.ok) {
				const data = await response.json();
				setSettings({ ...settings, ...data });
			}
		} catch (error) {
			console.error('Error fetching settings:', error);
		}
	};

	const fetchTaxRates = async () => {
		try {
			const response = await fetch(
				`/api/finance/settings/tax-rates?company=${companyId}`
			);
			if (response.ok) {
				const data = await response.json();
				setTaxRates(data);
			}
		} catch (error) {
			console.error('Error fetching tax rates:', error);
		}
	};

	const fetchSavedItems = async () => {
		try {
			const response = await fetch(
				`/api/finance/settings/saved-items?company=${companyId}`
			);
			if (response.ok) {
				const data = await response.json();
				setSavedItems(data);
			}
		} catch (error) {
			console.error('Error fetching saved items:', error);
		}
	};

	const handleSaveSettings = async () => {
		try {
			setLoading(true);
			const response = await fetch(`/api/finance/settings?company=${companyId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(settings),
			});

			if (response.ok) {
				showSuccessToast({
					title: 'Success',
					message: 'Settings saved successfully',
				});
			}
		} catch (error) {
			showErrorToast({
				title: 'Error',
				message: 'Failed to save settings',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleAddTaxRate = async () => {
		if (!newTaxRate.name || newTaxRate.rate <= 0) return;

		try {
			const response = await fetch(
				`/api/finance/settings/tax-rates?company=${companyId}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newTaxRate),
				}
			);

			if (response.ok) {
				setNewTaxRate({ name: '', rate: 0 });
				fetchTaxRates();
			}
		} catch (error) {
			console.error('Error adding tax rate:', error);
		}
	};

	const handleDeleteTaxRate = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/settings/tax-rates/${id}?company=${companyId}`,
				{ method: 'DELETE' }
			);

			if (response.ok) {
				fetchTaxRates();
			}
		} catch (error) {
			console.error('Error deleting tax rate:', error);
		}
	};

	const handleAddSavedItem = async () => {
		if (!newSavedItem.name || newSavedItem.rate <= 0) return;

		try {
			const response = await fetch(
				`/api/finance/settings/saved-items?company=${companyId}`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(newSavedItem),
				}
			);

			if (response.ok) {
				setNewSavedItem({
					name: '',
					description: '',
					rate: 0,
					itemType: 'service',
					sacCode: '',
				});
				fetchSavedItems();
			}
		} catch (error) {
			console.error('Error adding saved item:', error);
		}
	};

	const handleDeleteSavedItem = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/settings/saved-items/${id}?company=${companyId}`,
				{ method: 'DELETE' }
			);

			if (response.ok) {
				fetchSavedItems();
			}
		} catch (error) {
			console.error('Error deleting saved item:', error);
		}
	};

	return (
		<div className='p-6 space-y-6'>
			<div>
				<h1 className='text-2xl font-bold text-gray-900'>Finance Settings</h1>
				<p className='text-gray-500'>Configure your invoicing and billing preferences</p>
			</div>

			<Tabs defaultValue='general' className='space-y-6'>
				<TabsList>
					<TabsTrigger value='general'>General</TabsTrigger>
					<TabsTrigger value='tax-rates'>Tax Rates</TabsTrigger>
					<TabsTrigger value='saved-items'>Saved Items</TabsTrigger>
					<TabsTrigger value='bank'>Bank Details</TabsTrigger>
				</TabsList>

				{/* General Settings */}
				<TabsContent value='general'>
					<Card>
						<CardHeader className='px-6 pt-6 pb-2'>
							<CardTitle>General Settings</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6 px-6 pb-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Default Currency</Label>
									<Input
										value={settings.defaultCurrency}
										onChange={(e) =>
											setSettings({ ...settings, defaultCurrency: e.target.value })
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label>Default Payment Terms (days)</Label>
									<Input
										type='number'
										value={settings.defaultPaymentTerms}
										onChange={(e) =>
											setSettings({
												...settings,
												defaultPaymentTerms: parseInt(e.target.value) || 30,
											})
										}
									/>
								</div>
							</div>

							<div className='flex items-center justify-between'>
								<div>
									<Label>Enable GST</Label>
									<p className='text-sm text-gray-500'>
										Show GST fields on invoices
									</p>
								</div>
								<Switch
									checked={settings.enableGst}
									onCheckedChange={(checked) =>
										setSettings({ ...settings, enableGst: checked })
									}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Default Invoice Notes</Label>
								<Textarea
									value={settings.defaultInvoiceNotes}
									onChange={(e) =>
										setSettings({ ...settings, defaultInvoiceNotes: e.target.value })
									}
									placeholder='These notes will appear on all invoices'
									rows={3}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Default Invoice Footer</Label>
								<Textarea
									value={settings.defaultInvoiceFooter}
									onChange={(e) =>
										setSettings({ ...settings, defaultInvoiceFooter: e.target.value })
									}
									placeholder='Terms and conditions'
									rows={2}
								/>
							</div>

							<Button
								onClick={handleSaveSettings}
								disabled={loading}
								className='bg-green hover:bg-green/90'
							>
								<Save className='h-4 w-4 mr-2' />
								Save Settings
							</Button>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Tax Rates */}
				<TabsContent value='tax-rates'>
					<Card>
						<CardHeader className='px-6 pt-6 pb-2'>
							<CardTitle>Tax Rates</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6 px-6 pb-6'>
							{/* Add New Tax Rate */}
							<div className='flex gap-4 items-end'>
								<div className='flex-1 space-y-2'>
									<Label>Name</Label>
									<Input
										value={newTaxRate.name}
										onChange={(e) =>
											setNewTaxRate({ ...newTaxRate, name: e.target.value })
										}
										placeholder='e.g., GST 18%'
									/>
								</div>
								<div className='w-32 space-y-2'>
									<Label>Rate (%)</Label>
									<Input
										type='number'
										value={newTaxRate.rate}
										onChange={(e) =>
											setNewTaxRate({
												...newTaxRate,
												rate: parseFloat(e.target.value) || 0,
											})
										}
									/>
								</div>
								<Button onClick={handleAddTaxRate}>
									<Plus className='h-4 w-4 mr-2' />
									Add
								</Button>
							</div>

							{/* Tax Rates List */}
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Rate</TableHead>
										<TableHead>Default</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{taxRates.map((rate) => (
										<TableRow key={rate.id}>
											<TableCell>{rate.name}</TableCell>
											<TableCell>{rate.rate}%</TableCell>
											<TableCell>{rate.isDefault ? 'Yes' : '-'}</TableCell>
											<TableCell>
												<Button
													variant='ghost'
													size='icon'
													onClick={() => handleDeleteTaxRate(rate.id)}
												>
													<Trash2 className='h-4 w-4 text-red-500' />
												</Button>
											</TableCell>
										</TableRow>
									))}
									{taxRates.length === 0 && (
										<TableRow>
											<TableCell colSpan={4} className='text-center text-gray-500'>
												No tax rates configured
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Saved Items */}
				<TabsContent value='saved-items'>
					<Card>
						<CardHeader className='px-6 pt-6 pb-2'>
							<CardTitle>Saved Items</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6 px-6 pb-6'>
							{/* Add New Saved Item */}
							<div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-end'>
								<div className='space-y-2'>
									<Label>Name</Label>
									<Input
										value={newSavedItem.name}
										onChange={(e) =>
											setNewSavedItem({ ...newSavedItem, name: e.target.value })
										}
										placeholder='Item name'
									/>
								</div>
								<div className='space-y-2'>
									<Label>Rate</Label>
									<Input
										type='number'
										value={newSavedItem.rate}
										onChange={(e) =>
											setNewSavedItem({
												...newSavedItem,
												rate: parseFloat(e.target.value) || 0,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label>SAC Code</Label>
									<Input
										value={newSavedItem.sacCode}
										onChange={(e) =>
											setNewSavedItem({ ...newSavedItem, sacCode: e.target.value })
										}
										placeholder='998314'
									/>
								</div>
								<Button onClick={handleAddSavedItem}>
									<Plus className='h-4 w-4 mr-2' />
									Add
								</Button>
							</div>

							{/* Saved Items List */}
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Rate</TableHead>
										<TableHead>SAC Code</TableHead>
										<TableHead></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{savedItems.map((item) => (
										<TableRow key={item.id}>
											<TableCell>{item.name}</TableCell>
											<TableCell className='capitalize'>{item.itemType}</TableCell>
											<TableCell>{item.rate}</TableCell>
											<TableCell>{item.sacCode || '-'}</TableCell>
											<TableCell>
												<Button
													variant='ghost'
													size='icon'
													onClick={() => handleDeleteSavedItem(item.id)}
												>
													<Trash2 className='h-4 w-4 text-red-500' />
												</Button>
											</TableCell>
										</TableRow>
									))}
									{savedItems.length === 0 && (
										<TableRow>
											<TableCell colSpan={5} className='text-center text-gray-500'>
												No saved items
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Bank Details */}
				<TabsContent value='bank'>
					<Card>
						<CardHeader className='px-6 pt-6 pb-2'>
							<CardTitle>Bank Details</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4 px-6 pb-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Bank Name</Label>
									<Input
										value={settings.bankName}
										onChange={(e) =>
											setSettings({ ...settings, bankName: e.target.value })
										}
										placeholder='e.g., Kotak Mahindra Bank'
									/>
								</div>
								<div className='space-y-2'>
									<Label>Account Name</Label>
									<Input
										value={settings.bankAccountName}
										onChange={(e) =>
											setSettings({ ...settings, bankAccountName: e.target.value })
										}
									/>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Account Number</Label>
									<Input
										value={settings.bankAccountNumber}
										onChange={(e) =>
											setSettings({
												...settings,
												bankAccountNumber: e.target.value,
											})
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label>IFSC Code</Label>
									<Input
										value={settings.bankIfscCode}
										onChange={(e) =>
											setSettings({ ...settings, bankIfscCode: e.target.value })
										}
									/>
								</div>
							</div>

							<Button
								onClick={handleSaveSettings}
								disabled={loading}
								className='bg-green hover:bg-green/90'
							>
								<Save className='h-4 w-4 mr-2' />
								Save Bank Details
							</Button>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
