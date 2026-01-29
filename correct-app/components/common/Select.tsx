import React from 'react';
import {
	Select as RadixSelect,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

/**
 * Usage Example:
 * <Select
 *   label="Choose an option"
 *   options={[{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }]}
 *   value={selected}
 *   onChange={setSelected}
 *   placeholder="Select..."
 * />
 */

export interface Option {
	label: string;
	value: string;
}

export interface SelectProps {
	label?: string;
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	name?: string;
}

const Select: React.FC<SelectProps> = ({
	label,
	options,
	value,
	onChange,
	placeholder = 'Select...',
	disabled = false,
	className,
	name,
}) => {
	return (
		<div className={className}>
			{label && (
				<Label htmlFor={name} className='mb-1 block'>
					{label}
				</Label>
			)}
			<RadixSelect
				value={value}
				onValueChange={onChange}
				disabled={disabled}
				name={name}
			>
				<SelectTrigger id={name} className='w-full'>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</RadixSelect>
		</div>
	);
};

export default Select;
