// @ts-nocheck

import { Button, buttonVariants } from '@/components/ui/button';
import type { CalendarProps } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { add, format } from 'date-fns';
import { type Locale, enUS } from 'date-fns/locale';
import {
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Clock,
} from 'lucide-react';
import * as React from 'react';
import { useImperativeHandle, useRef } from 'react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { DayPicker } from 'react-day-picker';
import {
	genMonths,
	genYears,
	display12HourValue,
	set12Hours,
	setHours,
	setMinutes,
	setSeconds,
	getValidArrowNumber,
	getValidArrowMinuteOrSecond,
	getValidArrow12Hour,
	getValidArrowHour,
	getValidNumber,
	isValidMinuteOrSecond,
	isValid12Hour,
	isValidHour,
	generateDaysInMonth,
	convert12HourTo24Hour,
	getDateByType,
	setDateByType,
} from '@/utils/calendar-utils';

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	yearRange = 50,
	...props
}: CalendarProps & { yearRange?: number }) {
	const MONTHS = React.useMemo(() => {
		let locale: Pick<Locale, 'options' | 'localize' | 'formatLong'> = enUS;
		const { options, localize, formatLong } = props.locale || {};
		if (options && localize && formatLong) {
			locale = {
				options,
				localize,
				formatLong,
			};
		}
		return genMonths(locale);
	}, [props]);

	const YEARS = React.useMemo(() => genYears(yearRange), [yearRange]);

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn('p-3', className)}
			classNames={{
				months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
				month: 'space-y-4',
				caption: 'flex justify-center pt-1 relative items-center',
				caption_label: 'text-sm font-medium',
				nav: 'space-x-1 flex items-center',
				nav_button: cn(
					buttonVariants({ variant: 'outline' }),
					'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
				),
				nav_button_previous: 'absolute left-1',
				nav_button_next: 'absolute right-1',
				table: 'w-full border-collapse space-y-1',
				head_row: 'flex',
				head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
				row: 'flex w-full mt-2',
				cell: cn(
					'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md',
					props.mode === 'range'
						? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
						: '[&:has([aria-selected])]:rounded-md'
				),
				day: cn(
					buttonVariants({ variant: 'ghost' }),
					'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
				),
				day_range_start: 'day-range-start',
				day_range_end: 'day-range-end',
				day_selected:
					'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
				day_today: 'bg-accent text-accent-foreground',
				day_outside:
					'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
				day_disabled: 'text-muted-foreground opacity-50',
				day_range_middle:
					'aria-selected:bg-accent aria-selected:text-accent-foreground',
				day_hidden: 'invisible',
				...classNames,
			}}
			components={{
				IconLeft: ({ ...props }) => <ChevronLeft className='h-4 w-4' {...props} />,
				IconRight: ({ ...props }) => <ChevronRight className='size-4' {...props} />,
				MonthCaption: ({ calendarMonth }: { calendarMonth: { date: Date } }) => {
					return (
						<div className='inline-flex gap-2'>
							<Select
								defaultValue={calendarMonth.date.getMonth().toString()}
								onValueChange={(value) => {
									const newDate = new Date(calendarMonth.date);
									newDate.setMonth(Number.parseInt(value, 10));
									props.onMonthChange?.(newDate);
								}}
							>
								<SelectTrigger className='w-fit gap-1 border-none p-0 focus:bg-accent focus:text-accent-foreground'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{MONTHS.map((month) => (
										<SelectItem key={month.value} value={month.value.toString()}>
											{month.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								defaultValue={calendarMonth.date.getFullYear().toString()}
								onValueChange={(value) => {
									const newDate = new Date(calendarMonth.date);
									newDate.setFullYear(Number.parseInt(value, 10));
									props.onMonthChange?.(newDate);
								}}
							>
								<SelectTrigger className='w-fit gap-1 border-none p-0 focus:bg-accent focus:text-accent-foreground'>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{YEARS.map((year) => (
										<SelectItem key={year.value} value={year.value.toString()}>
											{year.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					);
				},
			}}
			{...props}
		/>
	);
}
Calendar.displayName = 'Calendar';

interface PeriodSelectorProps {
	period: Period;
	setPeriod?: (m: Period) => void;
	date?: Date | null;
	onDateChange?: (date: Date | undefined) => void;
	onRightFocus?: () => void;
	onLeftFocus?: () => void;
}

const TimePeriodSelect = React.forwardRef<
	HTMLButtonElement,
	PeriodSelectorProps
>(
	(
		{ period, setPeriod, date, onDateChange, onLeftFocus, onRightFocus },
		ref
	) => {
		const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.key === 'ArrowRight') onRightFocus?.();
			if (e.key === 'ArrowLeft') onLeftFocus?.();
		};

		const handleValueChange = (value: Period) => {
			setPeriod?.(value);

			/**
			 * trigger an update whenever the user switches between AM and PM;
			 * otherwise user must manually change the hour each time
			 */
			if (date) {
				const tempDate = new Date(date);
				const hours = display12HourValue(date.getHours());
				onDateChange?.(
					setDateByType(
						tempDate,
						hours.toString(),
						'12hours',
						period === 'AM' ? 'PM' : 'AM'
					)
				);
			}
		};

		return (
			<div className='flex h-10 items-center'>
				<Select
					defaultValue={period}
					onValueChange={(value: Period) => handleValueChange(value)}
				>
					<SelectTrigger
						ref={ref}
						className='w-[65px] focus:bg-accent focus:text-accent-foreground'
						onKeyDown={handleKeyDown}
					>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='AM'>AM</SelectItem>
						<SelectItem value='PM'>PM</SelectItem>
					</SelectContent>
				</Select>
			</div>
		);
	}
);

TimePeriodSelect.displayName = 'TimePeriodSelect';

interface TimePickerInputProps
	extends React.InputHTMLAttributes<HTMLIputElement> {
	picker: any;
	date?: Date | null;
	onDateChange?: (date: Date | undefined) => void;
	period?: Period;
	onRightFocus?: () => void;
	onLeftFocus?: () => void;
}

const TimePickerInput = React.forwardRef<
	HTMLInputElement,
	TimePickerInputProps
>(
	(
		{
			className,
			type = 'tel',
			value,
			id,
			name,
			date = new Date(new Date().setHours(0, 0, 0, 0)),
			onDateChange,
			onChange,
			onKeyDown,
			picker,
			period,
			onLeftFocus,
			onRightFocus,
			...props
		},
		ref
	) => {
		const [flag, setFlag] = React.useState<boolean>(false);
		const [prevIntKey, setPrevIntKey] = React.useState<string>('0');

		/**
		 * allow the user to enter the second digit within 2 seconds
		 * otherwise start again with entering first digit
		 */
		React.useEffect(() => {
			if (flag) {
				const timer = setTimeout(() => {
					setFlag(false);
				}, 2000);

				return () => clearTimeout(timer);
			}
		}, [flag]);

		const calculatedValue = React.useMemo(() => {
			return getDateByType(date, picker);
		}, [date, picker]);

		const calculateNewValue = (key: string) => {
			/*
			 * If picker is '12hours' and the first digit is 0, then the second digit is automatically set to 1.
			 * The second entered digit will break the condition and the value will be set to 10-12.
			 */
			if (picker === '12hours') {
				if (flag && calculatedValue.slice(1, 2) === '1' && prevIntKey === '0')
					return `0${key}`;
			}

			return !flag ? `0${key}` : calculatedValue.slice(1, 2) + key;
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Tab') return;
			e.preventDefault();
			if (e.key === 'ArrowRight') onRightFocus?.();
			if (e.key === 'ArrowLeft') onLeftFocus?.();
			if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
				const step = e.key === 'ArrowUp' ? 1 : -1;
				const newValue = getArrowByType(calculatedValue, step, picker);
				if (flag) setFlag(false);
				const tempDate = date ? new Date(date) : new Date();
				onDateChange?.(setDateByType(tempDate, newValue, picker, period));
			}
			if (e.key >= '0' && e.key <= '9') {
				if (picker === '12hours') setPrevIntKey(e.key);

				const newValue = calculateNewValue(e.key);
				if (flag) onRightFocus?.();
				setFlag((prev) => !prev);
				const tempDate = date ? new Date(date) : new Date();
				onDateChange?.(setDateByType(tempDate, newValue, picker, period));
			}
		};

		return (
			<Input
				ref={ref}
				id={id || picker}
				name={name || picker}
				className={cn(
					'w-[48px] text-center text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none',
					className
				)}
				value={value || calculatedValue}
				onChange={(e) => {
					e.preventDefault();
					onChange?.(e);
				}}
				type={type}
				inputMode='decimal'
				onKeyDown={(e) => {
					onKeyDown?.(e);
					handleKeyDown(e);
				}}
				{...props}
			/>
		);
	}
);

TimePickerInput.displayName = 'TimePickerInput';

interface TimePickerProps {
	date?: Date | null;
	onChange?: (date: Date | undefined) => void;
	hourCycle?: 12 | 24;
	/**
	 * Determines the smallest unit that is displayed in the datetime picker.
	 * Default is 'second'.
	 * */
	granularity?: Granularity;
}

interface TimePickerRef {
	minuteRef: HTMLInputElement | null;
	hourRef: HTMLInputElement | null;
	secondRef: HTMLInputElement | null;
}

const TimePicker = React.forwardRef<TimePickerRef, TimePickerProps>(
	({ date, onChange, hourCycle = 24, granularity = 'second' }, ref) => {
		const minuteRef = React.useRef<HTMLInputElement>(null);
		const hourRef = React.useRef<HTMLInputElement>(null);
		const secondRef = React.useRef<HTMLInputElement>(null);
		const periodRef = React.useRef<HTMLButtonElement>(null);
		const [period, setPeriod] = React.useState<Period>(
			date && date.getHours() >= 12 ? 'PM' : 'AM'
		);

		useImperativeHandle(
			ref,
			() => ({
				minuteRef: minuteRef.current,
				hourRef: hourRef.current,
				secondRef: secondRef.current,
				periodRef: periodRef.current,
			}),
			[minuteRef, hourRef, secondRef]
		);

		return (
			<div className='flex items-center justify-center gap-2'>
				<label htmlFor='datetime-picker-hour-input' className='cursor-pointer'>
					<Clock className='mr-2 h-4 w-4' />
				</label>
				<TimePickerInput
					picker={hourCycle === 24 ? 'hours' : '12hours'}
					date={date}
					id='datetime-picker-hour-input'
					onDateChange={onChange}
					ref={hourRef}
					period={period}
					onRightFocus={() => minuteRef?.current?.focus()}
				/>
				{(granularity === 'minute' || granularity === 'second') && (
					<>
						:
						<TimePickerInput
							picker='minutes'
							date={date}
							onDateChange={onChange}
							ref={minuteRef}
							onLeftFocus={() => hourRef?.current?.focus()}
							onRightFocus={() => secondRef?.current?.focus()}
						/>
					</>
				)}
				{granularity === 'second' && (
					<>
						:
						<TimePickerInput
							picker='seconds'
							date={date}
							onDateChange={onChange}
							ref={secondRef}
							onLeftFocus={() => minuteRef?.current?.focus()}
							onRightFocus={() => periodRef?.current?.focus()}
						/>
					</>
				)}
				{hourCycle === 12 && (
					<div className='grid gap-1 text-center'>
						<TimePeriodSelect
							period={period}
							setPeriod={setPeriod}
							date={date}
							onDateChange={(date) => {
								onChange?.(date);
								if (date && date?.getHours() >= 12) {
									setPeriod('PM');
								} else {
									setPeriod('AM');
								}
							}}
							ref={periodRef}
							onLeftFocus={() => secondRef?.current?.focus()}
						/>
					</div>
				)}
			</div>
		);
	}
);
TimePicker.displayName = 'TimePicker';

type Granularity = 'day' | 'hour' | 'minute' | 'second';

type DateTimePickerProps = {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	disabled?: boolean;
	/** showing `AM/PM` or not. */
	hourCycle?: 12 | 24;
	placeholder?: string;
	/**
	 * The year range will be: `This year + yearRange` and `this year - yearRange`.
	 * Default is 50.
	 * For example:
	 * This year is 2024, The year dropdown will be 1974 to 2024 which is generated by `2024 - 50 = 1974` and `2024 + 50 = 2074`.
	 * */
	yearRange?: number;
	/**
	 * The format is derived from the `date-fns` documentation.
	 * @reference https://date-fns.org/v3.6.0/docs/format
	 **/
	displayFormat?: { hour24?: string; hour12?: string };
	/**
	 * The granularity prop allows you to control the smallest unit that is displayed by DateTimePicker.
	 * By default, the value is `second` which shows all time inputs.
	 **/
	granularity?: Granularity;
	className?: string;
} & Pick<
	CalendarProps,
	'locale' | 'weekStartsOn' | 'showWeekNumber' | 'showOutsideDays'
>;

type DateTimePickerRef = {
	value?: Date;
} & Omit<HTMLButtonElement, 'value'>;

const DateTimePicker = React.forwardRef<
	Partial<DateTimePickerRef>,
	DateTimePickerProps
>(
	(
		{
			locale = enUS,
			value,
			onChange,
			hourCycle = 24,
			yearRange = 50,
			disabled = false,
			displayFormat,
			granularity = 'second',
			placeholder = 'Pick a date',
			className,
			...props
		},
		ref
	) => {
		const [month, setMonth] = React.useState<Date>(value ?? new Date());
		const buttonRef = useRef<HTMLButtonElement>(null);
		/**
		 * carry over the current time when a user clicks a new day
		 * instead of resetting to 00:00
		 */
		const handleSelect = (newDay: Date | undefined) => {
			if (!newDay) return;
			if (!value) {
				onChange?.(newDay);
				setMonth(newDay);
				return;
			}
			const diff = newDay.getTime() - value.getTime();
			const diffInDays = diff / (1000 * 60 * 60 * 24);
			const newDateFull = add(value, { days: Math.ceil(diffInDays) });
			onChange?.(newDateFull);
			setMonth(newDateFull);
		};

		useImperativeHandle(
			ref,
			() => ({
				...buttonRef.current,
				value,
			}),
			[value]
		);

		const initHourFormat = {
			hour24:
				displayFormat?.hour24 ??
				`PPP HH:mm${!granularity || granularity === 'second' ? ':ss' : ''}`,
			hour12:
				displayFormat?.hour12 ??
				`PP hh:mm${!granularity || granularity === 'second' ? ':ss' : ''} b`,
		};

		let loc = enUS;
		const { options, localize, formatLong } = locale;
		if (options && localize && formatLong) {
			loc = {
				...enUS,
				options,
				localize,
				formatLong,
			};
		}

		return (
			<Popover>
				<PopoverTrigger asChild disabled={disabled}>
					<Button
						variant='outline'
						className={cn(
							'w-full justify-start text-left font-normal',
							!value && 'text-muted-foreground',
							className
						)}
						ref={buttonRef}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{value ? (
							format(
								value,
								hourCycle === 24 ? initHourFormat.hour24 : initHourFormat.hour12,
								{
									locale: loc,
								}
							)
						) : (
							<span>{placeholder}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0'>
					<Calendar
						mode='single'
						selected={value}
						month={month}
						onSelect={(d) => handleSelect(d)}
						onMonthChange={handleSelect}
						yearRange={yearRange}
						locale={locale}
						{...props}
					/>
					{granularity !== 'day' && (
						<div className='border-t border-border p-3'>
							<TimePicker
								onChange={onChange}
								date={value}
								hourCycle={hourCycle}
								granularity={granularity}
							/>
						</div>
					)}
				</PopoverContent>
			</Popover>
		);
	}
);

DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker, TimePicker, TimePickerInput };
// export type { DateTimePickerProps, DateTimePickerRef };
