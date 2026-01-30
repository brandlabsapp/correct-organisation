'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Plus,
	MoreHorizontal,
	Play,
	Pause,
	Edit,
	Trash2,
	RefreshCw,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';
import { EmptyState, ListSkeleton } from '@/components/finance/shared/EmptyState';

interface RecurringProfile {
	id: string;
	profileName: string;
	frequency: string;
	status: string;
	nextRun: string;
	lastRun: string;
	occurrenceCount: number;
	maxOccurrences: number;
	currency: string;
	client?: {
		id: string;
		name: string;
	};
	lineItemsJson?: string;
}

interface Client {
	id: string;
	name: string;
}

const statusColors: Record<string, string> = {
	active: 'bg-green-100 text-green-800',
	paused: 'bg-yellow-100 text-yellow-800',
	completed: 'bg-gray-100 text-gray-800',
};

const frequencyLabels: Record<string, string> = {
	weekly: 'Weekly',
	biweekly: 'Bi-weekly',
	monthly: 'Monthly',
	quarterly: 'Quarterly',
	half_yearly: 'Half Yearly',
	yearly: 'Yearly',
};

export function RecurringList() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [profiles, setProfiles] = useState<RecurringProfile[]>([]);
	const [clients, setClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);

	const [formData, setFormData] = useState({
		profileName: '',
		clientId: '',
		frequency: 'monthly',
		startDate: new Date().toISOString().split('T')[0],
		endDate: '',
		maxOccurrences: '',
		currency: 'INR',
		paymentTerms: 'net_30',
		autoSend: false,
		lineItems: [{ description: '', quantity: 1, rate: 0, taxRate: 18 }],
	});

	useEffect(() => {
		if (companyId) {
			fetchProfiles();
			fetchClients();
		}
	}, [companyId]);

	const fetchProfiles = async () => {
		try {
			setLoading(true);
			const response = await fetch(`/api/finance/recurring?company=${companyId}`);
			if (response.ok) {
				const data = await response.json();
				setProfiles(data.rows || []);
			}
		} catch (error) {
			console.error('Error fetching profiles:', error);
		} finally {
			setLoading(false);
		}
	};

	const fetchClients = async () => {
		try {
			const response = await fetch(`/api/finance/clients?company=${companyId}`);
			if (response.ok) {
				const data = await response.json();
				setClients(data.rows || []);
			}
		} catch (error) {
			console.error('Error fetching clients:', error);
		}
	};

	const handleCreate = async () => {
		try {
			const payload = {
				...formData,
				maxOccurrences: formData.maxOccurrences
					? parseInt(formData.maxOccurrences)
					: undefined,
				lineItems: formData.lineItems.filter((item) => item.description),
			};

			const response = await fetch(`/api/finance/recurring?company=${companyId}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				showSuccessToast({
					title: 'Success',
					message: 'Recurring profile created',
				});
				setDialogOpen(false);
				fetchProfiles();
			} else {
				const error = await response.json();
				showErrorToast({
					title: 'Error',
					message: error.message || 'Failed to create profile',
				});
			}
		} catch (error) {
			showErrorToast({
				title: 'Error',
				message: 'Failed to create profile',
			});
		}
	};

	const handlePause = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/recurring/${id}/pause?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				fetchProfiles();
			}
		} catch (error) {
			console.error('Error pausing profile:', error);
		}
	};

	const handleResume = async (id: string) => {
		try {
			const response = await fetch(
				`/api/finance/recurring/${id}/resume?company=${companyId}`,
				{ method: 'POST' }
			);
			if (response.ok) {
				fetchProfiles();
			}
		} catch (error) {
			console.error('Error resuming profile:', error);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this recurring profile?'))
			return;
		try {
			const response = await fetch(
				`/api/finance/recurring/${id}?company=${companyId}`,
				{ method: 'DELETE' }
			);
			if (response.ok) {
				fetchProfiles();
			}
		} catch (error) {
			console.error('Error deleting profile:', error);
		}
	};

	const calculateEstimatedTotal = () => {
		return formData.lineItems.reduce((sum, item) => {
			const amount = item.quantity * item.rate;
			const tax = (amount * item.taxRate) / 100;
			return sum + amount + tax;
		}, 0);
	};

	return (
		<div className='p-6 space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Recurring Invoices</h1>
					<p className='text-gray-500'>
						Automate your invoicing with recurring profiles
					</p>
				</div>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button className='bg-green hover:bg-green/90'>
							<Plus className='h-4 w-4 mr-2' />
							New Recurring Profile
						</Button>
					</DialogTrigger>
					<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
						<DialogHeader>
							<DialogTitle>Create Recurring Invoice Profile</DialogTitle>
						</DialogHeader>
						<div className='space-y-4 py-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Profile Name *</Label>
									<Input
										value={formData.profileName}
										onChange={(e) =>
											setFormData({ ...formData, profileName: e.target.value })
										}
										placeholder='e.g., Monthly Retainer'
									/>
								</div>
								<div className='space-y-2'>
									<Label>Client</Label>
									<Select
										value={formData.clientId}
										onValueChange={(value) =>
											setFormData({ ...formData, clientId: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select client' />
										</SelectTrigger>
										<SelectContent>
											{clients.map((client) => (
												<SelectItem key={client.id} value={client.id}>
													{client.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>Frequency *</Label>
									<Select
										value={formData.frequency}
										onValueChange={(value) =>
											setFormData({ ...formData, frequency: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='weekly'>Weekly</SelectItem>
											<SelectItem value='biweekly'>Bi-weekly</SelectItem>
											<SelectItem value='monthly'>Monthly</SelectItem>
											<SelectItem value='quarterly'>Quarterly</SelectItem>
											<SelectItem value='half_yearly'>Half Yearly</SelectItem>
											<SelectItem value='yearly'>Yearly</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div className='space-y-2'>
									<Label>Start Date *</Label>
									<Input
										type='date'
										value={formData.startDate}
										onChange={(e) =>
											setFormData({ ...formData, startDate: e.target.value })
										}
									/>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label>End Date (optional)</Label>
									<Input
										type='date'
										value={formData.endDate}
										onChange={(e) =>
											setFormData({ ...formData, endDate: e.target.value })
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label>Max Occurrences (optional)</Label>
									<Input
										type='number'
										value={formData.maxOccurrences}
										onChange={(e) =>
											setFormData({ ...formData, maxOccurrences: e.target.value })
										}
										placeholder='Unlimited'
									/>
								</div>
							</div>

							{/* Line Items */}
							<div className='space-y-2'>
								<Label>Line Items</Label>
								{formData.lineItems.map((item, index) => (
									<div key={index} className='flex gap-2 items-end'>
										<div className='flex-1'>
											<Input
												value={item.description}
												onChange={(e) => {
													const items = [...formData.lineItems];
													items[index].description = e.target.value;
													setFormData({ ...formData, lineItems: items });
												}}
												placeholder='Description'
											/>
										</div>
										<div className='w-20'>
											<Input
												type='number'
												value={item.quantity}
												onChange={(e) => {
													const items = [...formData.lineItems];
													items[index].quantity = parseFloat(e.target.value) || 1;
													setFormData({ ...formData, lineItems: items });
												}}
												placeholder='Qty'
											/>
										</div>
										<div className='w-28'>
											<Input
												type='number'
												value={item.rate}
												onChange={(e) => {
													const items = [...formData.lineItems];
													items[index].rate = parseFloat(e.target.value) || 0;
													setFormData({ ...formData, lineItems: items });
												}}
												placeholder='Rate'
											/>
										</div>
										<div className='w-20'>
											<Input
												type='number'
												value={item.taxRate}
												onChange={(e) => {
													const items = [...formData.lineItems];
													items[index].taxRate = parseFloat(e.target.value) || 0;
													setFormData({ ...formData, lineItems: items });
												}}
												placeholder='Tax %'
											/>
										</div>
									</div>
								))}
								<Button
									variant='outline'
									size='sm'
									onClick={() =>
										setFormData({
											...formData,
											lineItems: [
												...formData.lineItems,
												{ description: '', quantity: 1, rate: 0, taxRate: 18 },
											],
										})
									}
								>
									<Plus className='h-3 w-3 mr-1' />
									Add Item
								</Button>
							</div>

							<div className='text-right font-medium'>
								Estimated Total: {formatCurrency(calculateEstimatedTotal(), 'INR')}
							</div>

							<div className='flex justify-end gap-2 pt-4'>
								<Button variant='outline' onClick={() => setDialogOpen(false)}>
									Cancel
								</Button>
								<Button
									className='bg-green hover:bg-green/90'
									onClick={handleCreate}
								>
									Create Profile
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{/* Profiles Table */}
			<Card>
				<CardContent className='p-0'>
					{loading ? (
						<ListSkeleton rows={5} />
					) : profiles.length === 0 ? (
						<EmptyState
							type='invoices'
							title='No recurring profiles'
							description='Create a recurring profile to automatically generate invoices on a schedule.'
							onAction={() => setDialogOpen(true)}
							actionLabel='Create Recurring Profile'
						/>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Profile Name</TableHead>
									<TableHead>Client</TableHead>
									<TableHead>Frequency</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Next Run</TableHead>
									<TableHead>Occurrences</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{profiles.map((profile) => (
									<TableRow key={profile.id}>
										<TableCell className='font-medium'>
											{profile.profileName}
										</TableCell>
										<TableCell>{profile.client?.name || '-'}</TableCell>
										<TableCell>
											{frequencyLabels[profile.frequency] || profile.frequency}
										</TableCell>
										<TableCell>
											<Badge className={statusColors[profile.status]}>
												{profile.status}
											</Badge>
										</TableCell>
										<TableCell>
											{profile.nextRun
												? new Date(profile.nextRun).toLocaleDateString()
												: '-'}
										</TableCell>
										<TableCell>
											{profile.occurrenceCount}
											{profile.maxOccurrences
												? ` / ${profile.maxOccurrences}`
												: ''}
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' size='icon'>
														<MoreHorizontal className='h-4 w-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end'>
													{profile.status === 'active' ? (
														<DropdownMenuItem
															onClick={() => handlePause(profile.id)}
														>
															<Pause className='h-4 w-4 mr-2' />
															Pause
														</DropdownMenuItem>
													) : profile.status === 'paused' ? (
														<DropdownMenuItem
															onClick={() => handleResume(profile.id)}
														>
															<Play className='h-4 w-4 mr-2' />
															Resume
														</DropdownMenuItem>
													) : null}
													<DropdownMenuItem
														onClick={() => handleDelete(profile.id)}
														className='text-red-600'
													>
														<Trash2 className='h-4 w-4 mr-2' />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
