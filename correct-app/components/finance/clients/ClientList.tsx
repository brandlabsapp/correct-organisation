'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, Mail, Phone, Download } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '@/lib/utils/toast-handlers';
import { EmptyState, ListSkeleton } from '@/components/finance/shared/EmptyState';
import { exportClientsToCsv } from '@/lib/utils/csv-export';

interface Client {
	id: string;
	name: string;
	email: string;
	phone: string;
	clientType: string;
	city: string;
	country: string;
	gstNumber: string;
	panNumber: string;
}

export function ClientList() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const companyId = searchParams.get('company');

	const [clients, setClients] = useState<Client[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState('');
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingClient, setEditingClient] = useState<Client | null>(null);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		clientType: 'customer',
		billingAddress: '',
		city: '',
		state: '',
		country: 'India',
		postalCode: '',
		gstNumber: '',
		panNumber: '',
		notes: '',
	});

	useEffect(() => {
		if (companyId) {
			fetchClients();
		}
	}, [companyId]);

	const fetchClients = async () => {
		try {
			setLoading(true);
			const params = new URLSearchParams({ company: companyId! });
			if (search) params.append('search', search);

			const response = await fetch(`/api/finance/clients?${params}`);
			if (response.ok) {
				const data = await response.json();
				setClients(data.rows || []);
			}
		} catch (error) {
			console.error('Error fetching clients:', error);
		} finally {
			setLoading(false);
		}
	};

	const resetForm = () => {
		setFormData({
			name: '',
			email: '',
			phone: '',
			clientType: 'customer',
			billingAddress: '',
			city: '',
			state: '',
			country: 'India',
			postalCode: '',
			gstNumber: '',
			panNumber: '',
			notes: '',
		});
		setEditingClient(null);
	};

	const handleOpenDialog = (client?: Client) => {
		if (!companyId || companyId === 'null') {
			showErrorToast({
				title: 'Company required',
				message: 'Please select a company from the header to add or edit clients.',
			});
			return;
		}
		if (client) {
			setEditingClient(client);
			setFormData({
				name: client.name || '',
				email: client.email || '',
				phone: client.phone || '',
				clientType: client.clientType || 'customer',
				billingAddress: '',
				city: client.city || '',
				state: '',
				country: client.country || 'India',
				postalCode: '',
				gstNumber: client.gstNumber || '',
				panNumber: client.panNumber || '',
				notes: '',
			});
		} else {
			resetForm();
		}
		setDialogOpen(true);
	};

	const handleSubmit = async () => {
		if (!companyId || companyId === 'null') {
			showErrorToast({
				title: 'Company required',
				message: 'Please select a company before creating or updating a client.',
			});
			return;
		}
		if (!formData.name?.trim()) {
			showErrorToast({
				title: 'Validation',
				message: 'Client name is required.',
			});
			return;
		}
		try {
			const url = editingClient
				? `/api/finance/clients/${editingClient.id}?company=${companyId}`
				: `/api/finance/clients?company=${companyId}`;

			const response = await fetch(url, {
				method: editingClient ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const data = await response.json().catch(() => ({}));
			if (response.ok) {
				showSuccessToast({
					title: 'Success',
					message: `Client ${editingClient ? 'updated' : 'created'} successfully`,
				});
				setDialogOpen(false);
				resetForm();
				fetchClients();
			} else {
				showErrorToast({
					title: 'Error',
					message: data.message || `Failed to save client (${response.status})`,
				});
			}
		} catch (error) {
			console.error('Error saving client:', error);
			showErrorToast({
				title: 'Error',
				message: 'Failed to save client. Please try again.',
			});
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this client?')) return;

		try {
			const response = await fetch(
				`/api/finance/clients/${id}?company=${companyId}`,
				{ method: 'DELETE' }
			);

			if (response.ok) {
				showSuccessToast({
					title: 'Success',
					message: 'Client deleted successfully',
				});
				fetchClients();
			}
		} catch (error) {
			console.error('Error deleting client:', error);
		}
	};

	return (
		<div className='p-6 space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Clients</h1>
					<p className='text-gray-500'>Manage your customers and vendors</p>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						onClick={() => exportClientsToCsv(clients)}
						disabled={clients.length === 0}
					>
						<Download className='h-4 w-4 mr-2' />
						Export CSV
					</Button>
					<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
						<DialogTrigger asChild>
							<Button
								className='bg-green hover:bg-green/90'
								onClick={() => handleOpenDialog()}
								disabled={!companyId || companyId === 'null'}
							>
								<Plus className='h-4 w-4 mr-2' />
								New Client
							</Button>
						</DialogTrigger>
					<DialogContent className='max-w-xl max-h-[90vh] overflow-y-auto bg-white'>
						<DialogHeader>
							<DialogTitle className='text-gray-900'>
								{editingClient ? 'Edit Client' : 'New Client'}
							</DialogTitle>
						</DialogHeader>
						<div className='space-y-6 py-2'>
							<div className='grid grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<Label className='text-gray-700'>Name *</Label>
									<Input
										value={formData.name}
										onChange={(e) =>
											setFormData({ ...formData, name: e.target.value })
										}
										placeholder='Your company name'
									/>
								</div>
								<div className='space-y-2'>
									<Label className='text-gray-700'>Type</Label>
									<Select
										value={formData.clientType}
										onValueChange={(value) =>
											setFormData({ ...formData, clientType: value })
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent className='bg-white'>
											<SelectItem value='customer'>Customer</SelectItem>
											<SelectItem value='vendor'>Vendor</SelectItem>
											<SelectItem value='both'>Both</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<Label>Email</Label>
									<Input
										type='email'
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										placeholder='email@example.com'
									/>
								</div>
								<div className='space-y-2'>
									<Label>Phone</Label>
									<Input
										value={formData.phone}
										onChange={(e) =>
											setFormData({ ...formData, phone: e.target.value })
										}
										placeholder='+91 98765 43210'
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<Label className='text-gray-700'>Street address</Label>
								<Textarea
									value={formData.billingAddress}
									onChange={(e) =>
										setFormData({ ...formData, billingAddress: e.target.value })
									}
									placeholder='Street address'
									rows={2}
								/>
							</div>

							<div className='grid grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<Label className='text-gray-700'>City</Label>
									<Input
										value={formData.city}
										onChange={(e) =>
											setFormData({ ...formData, city: e.target.value })
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label className='text-gray-700'>State</Label>
									<Input
										value={formData.state}
										onChange={(e) =>
											setFormData({ ...formData, state: e.target.value })
										}
									/>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<Label className='text-gray-700'>Country</Label>
									<Input
										value={formData.country}
										onChange={(e) =>
											setFormData({ ...formData, country: e.target.value })
										}
									/>
								</div>
								<div className='space-y-2'>
									<Label className='text-gray-700'>PAN Number</Label>
									<Input
										value={formData.panNumber}
										onChange={(e) =>
											setFormData({ ...formData, panNumber: e.target.value })
										}
										placeholder='AAAAA0000A'
									/>
								</div>
							</div>

							<div className='space-y-2'>
								<Label className='text-gray-700'>GST Number</Label>
								<Input
									value={formData.gstNumber}
									onChange={(e) =>
										setFormData({ ...formData, gstNumber: e.target.value })
									}
									placeholder='22AAAAA0000A1Z5'
								/>
							</div>

							<div className='space-y-2'>
								<Label className='text-gray-700'>Internal notes about this client</Label>
								<Textarea
									value={formData.notes}
									onChange={(e) =>
										setFormData({ ...formData, notes: e.target.value })
									}
									placeholder='Internal notes about this client'
									rows={2}
								/>
							</div>

							<div className='flex justify-end gap-2 pt-4'>
								<Button variant='outline' onClick={() => setDialogOpen(false)}>
									Cancel
								</Button>
								<Button
									className='bg-green hover:bg-green/90'
									onClick={handleSubmit}
								>
									{editingClient ? 'Update' : 'Create'} Client
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
				</div>
			</div>

			{/* Search */}
			<Card>
				<CardContent className='p-4'>
					<div className='relative max-w-md'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
						<Input
							placeholder='Search clients...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && fetchClients()}
							className='pl-10'
						/>
					</div>
				</CardContent>
			</Card>

			{/* Client Table */}
			<Card>
				<CardContent className='p-0'>
					{!companyId || companyId === 'null' ? (
						<EmptyState
							type='generic'
							title='Select a company'
							description='Choose a company from the header to view and add clients.'
						/>
					) : loading ? (
						<ListSkeleton rows={5} />
					) : clients.length === 0 ? (
						<EmptyState
							type='clients'
							onAction={() => handleOpenDialog()}
						/>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Contact</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Location</TableHead>
									<TableHead>GST/PAN</TableHead>
									<TableHead></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{clients.map((client) => (
									<TableRow key={client.id}>
										<TableCell className='font-medium'>{client.name}</TableCell>
										<TableCell>
											<div className='space-y-1'>
												{client.email && (
													<div className='flex items-center gap-1 text-sm text-gray-500'>
														<Mail className='h-3 w-3' />
														{client.email}
													</div>
												)}
												{client.phone && (
													<div className='flex items-center gap-1 text-sm text-gray-500'>
														<Phone className='h-3 w-3' />
														{client.phone}
													</div>
												)}
											</div>
										</TableCell>
										<TableCell className='capitalize'>{client.clientType}</TableCell>
										<TableCell>
											{[client.city, client.country].filter(Boolean).join(', ') ||
												'-'}
										</TableCell>
										<TableCell>
											<div className='text-sm'>
												{client.gstNumber && <div>GST: {client.gstNumber}</div>}
												{client.panNumber && <div>PAN: {client.panNumber}</div>}
												{!client.gstNumber && !client.panNumber && '-'}
											</div>
										</TableCell>
										<TableCell>
											<div className='flex gap-2'>
												<Button
													variant='ghost'
													size='icon'
													onClick={() => handleOpenDialog(client)}
												>
													<Edit className='h-4 w-4' />
												</Button>
												<Button
													variant='ghost'
													size='icon'
													onClick={() => handleDelete(client.id)}
												>
													<Trash2 className='h-4 w-4 text-red-500' />
												</Button>
											</div>
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
