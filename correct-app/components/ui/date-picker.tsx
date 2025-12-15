'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';

interface IDatePickerProps {
	handleSetDate?: (date: Date) => void;
	label?: string;
	className?: string;
	initialDate?: Date;
}

export function DatePicker({
	handleSetDate,
	label = 'Pick a date',
	className,
	initialDate,
}: IDatePickerProps) {
	const [date, setDate] = React.useState<Date>(initialDate || new Date());
	const handleDateChange = (date: Date | undefined) => {
		if (date) {
			setDate(date);
			handleSetDate && handleSetDate(date);
		}
	};

	const [year, setYear] = React.useState(
		initialDate?.getFullYear() || new Date().getFullYear()
	);
	const [month, setMonth] = React.useState(
		initialDate?.getMonth() || new Date().getMonth()
	);

	const years = Array.from(
		{ length: 100 },
		(_, i) => new Date().getFullYear() - i
	);

	const handleYearChange = (selectedYear: string) => {
		const newYear = parseInt(selectedYear, 10);
		setYear(newYear);
		if (date) {
			const newDate = new Date(date);
			newDate.setFullYear(newYear);
			setDate(newDate);
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					className={cn(
						'w-full sm:w-[280px] justify-start text-left font-normal',
						!date && 'text-muted-foreground',
						className
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{date ? format(date, 'PPP') : <span>{label}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[280px] sm:w-auto p-0 bg-white' align='start'>
				<div className='flex items-center justify-between p-2'>
					<Select value={year.toString()} onValueChange={handleYearChange}>
						<SelectTrigger className='w-full px-3 sm:px-5'>
							<SelectValue>{year}</SelectValue>
						</SelectTrigger>
						<SelectContent className='bg-white'>
							{years.map((y) => (
								<SelectItem key={y} value={y.toString()}>
									{y}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<Calendar
					mode='single'
					selected={date}
					onSelect={handleDateChange}
					month={new Date(year, month)}
					onMonthChange={(newMonth) => {
						setMonth(newMonth.getMonth());
						setYear(newMonth.getFullYear());
					}}
					className='bg-white text-black'
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
