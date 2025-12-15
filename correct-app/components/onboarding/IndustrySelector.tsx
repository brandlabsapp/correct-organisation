import { Control, Controller, Path, FieldValues } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { industries } from '@/data/static/onboarding';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IndustrySelectorProps<T extends FieldValues> {
	name: Path<T>;
	control: Control<T>;
	errors?: Record<string, any>;
	required?: boolean;
}

export function IndustrySelector<T extends FieldValues>({
	name,
	control,
	errors,
	required = true,
}: IndustrySelectorProps<T>) {
	const errorMessage = errors?.[name]?.message as string | undefined;

	return (
		<div className='space-y-2'>
			<Label htmlFor={name}>Industry {required && '*'}</Label>
			<Controller
				name={name}
				control={control}
				rules={required ? { required: 'Please select an industry' } : undefined}
				render={({ field }) => (
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant='outline'
								role='combobox'
								className='w-full justify-between'
								aria-expanded={false}
							>
								{field.value
									? industries.find((industry) => industry.value === field.value)?.label
									: 'Select industry'}
								<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
							</Button>
						</PopoverTrigger>
						<PopoverContent className='w-full p-0 max-h-[300px] overflow-y-auto'>
							<Command>
								<CommandInput placeholder='Search industry...' />
								<CommandEmpty>No industry found.</CommandEmpty>
								<CommandGroup>
									{industries.map((industry) => (
										<CommandItem
											key={industry.value}
											value={industry.value}
											onSelect={() => {
												field.onChange(industry.value);
											}}
										>
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													field.value === industry.value ? 'opacity-100' : 'opacity-0'
												)}
											/>
											{industry.label}
										</CommandItem>
									))}
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				)}
			/>
			{errorMessage && <p className='text-red-500 text-sm'>{errorMessage}</p>}
		</div>
	);
}
