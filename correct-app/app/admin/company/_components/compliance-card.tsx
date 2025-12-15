import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from '@radix-ui/react-icons';
// Replaced moment with date-fns for smaller bundle size
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Compliance {
	id: number;
	title: string;
	status: 'completed' | 'in-progress' | 'not-started';
	startDate: string;
	endDate: string;
}

export default function ComplianceCardList({
	compliances,
	editingId,
	handleSave,
	handleEdit,
	handleRemove,
	handleInputChange,
}: {
	compliances: any[];
	editingId: number | null;
	handleSave: (id: number) => void;
	handleEdit: (id: number) => void;
	handleRemove: (id: number) => void;
	handleInputChange: (
		id: number,
		field: keyof Compliance,
		value: string
	) => void;
}) {
	return (
		<div className='block md:hidden space-y-4 mt-6 max-h-[500px] overflow-y-auto scrollbar-hide'>
			{compliances.map(
				(compliance: any) => (
					console.log('compliance', compliance),
					(
						<Card key={compliance.id} className='border border-border'>
							<CardContent className='p-4 space-y-2'>
								<div className='flex justify-between items-center mb-4'>
									<span className='font-medium'>
										{compliance?.compliance?.formName || compliance?.compliance?.formId}
									</span>
									<div className='space-x-2'>
										{editingId === compliance.id ? (
											<Button
												variant='outline'
												size='xs'
												onClick={() => handleSave(compliance.id)}
											>
												Save Changes
											</Button>
										) : (
											<Button
												variant='ghost'
												size='xs'
												onClick={() => handleEdit(compliance.id)}
											>
												Edit
											</Button>
										)}
										<Button
											variant='destructive'
											size='xs'
											onClick={() => handleRemove(compliance.id)}
										>
											Remove
										</Button>
									</div>
								</div>
								<div className='grid grid-cols-4 text-xs'>
									<div className='text-muted-foreground'>Status</div>
									<div className='col-span-3'>
										{editingId === compliance.id ? (
											<Select
												value={compliance.status}
												defaultValue={compliance.status}
												onValueChange={(value) =>
													handleInputChange(
														compliance.id,
														'status',
														value as Compliance['status']
													)
												}
											>
												<SelectTrigger className='w-full'>
													<SelectValue placeholder='Select status' />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='completed'>Completed</SelectItem>
													<SelectItem value='in-progress'>In Progress</SelectItem>
													<SelectItem value='not-started'>Not Started</SelectItem>
												</SelectContent>
											</Select>
										) : (
											<Badge
												variant={
													compliance.status === 'completed'
														? 'default'
														: compliance.status === 'in-progress'
														? 'secondary'
														: 'destructive'
												}
											>
												{compliance.status === 'completed'
													? 'Completed'
													: compliance.status === 'in-progress'
													? 'In Progress'
													: 'Not Started'}
											</Badge>
										)}
									</div>

									<div className='text-muted-foreground mt-3'>Start Date</div>
									<div className='col-span-3 mt-3'>
										{editingId === compliance.id ? (
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant='outline'
														className={cn(
															'w-full justify-start text-left font-normal',
															!compliance.startDate && 'text-muted-foreground'
														)}
													>
														<CalendarIcon className='mr-2 h-4 w-4' />
														{compliance.startDate ? (
														format(new Date(compliance.startDate), 'yyyy-MM-dd') // date-fns format
													) : (
														<span>Pick a date</span>
													)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className='w-auto p-0'>
													<Calendar
														mode='single'
														selected={new Date(compliance.startDate)}
														onSelect={(date) =>
															handleInputChange(
																compliance.id,
																'startDate',
																date ? date.toISOString() : ''
															)
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										) : (
										format(new Date(compliance.startDate), 'yyyy-MM-dd') // date-fns format
									)}
									</div>
									<div className='text-muted-foreground mt-3'>End Date</div>
									<div className='col-span-3 mt-3'>
										{editingId === compliance.id ? (
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant='outline'
														className={cn(
															'w-full justify-start text-left font-normal',
															!compliance.startDate && 'text-muted-foreground'
														)}
													>
														<CalendarIcon className='mr-2 h-4 w-4' />
														{compliance.endDate ? (
														format(new Date(compliance.endDate), 'yyyy-MM-dd') // date-fns format
													) : (
														<span>Pick a date</span>
													)}
													</Button>
												</PopoverTrigger>
												<PopoverContent className='w-auto p-0'>
													<Calendar
														mode='single'
														selected={new Date(compliance.endDate)}
														onSelect={(date) =>
															handleInputChange(
																compliance.id,
																'endDate',
																date ? date.toISOString() : ''
															)
														}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
										) : (
										format(new Date(compliance.endDate), 'yyyy-MM-dd') // date-fns format
									)}
									</div>
								</div>
							</CardContent>
						</Card>
					)
				)
			)}
		</div>
	);
}
