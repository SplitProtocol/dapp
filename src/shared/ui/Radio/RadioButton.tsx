import { type ChangeEvent, type FC } from 'react';

import { clsxMerge } from '@/shared/lib/clsxMerge';

export type RadioButtonSize = 'xs' | 'sm' | 'md';


const classNameBySize: Record<RadioButtonSize, string> = {
	sm: 'w-fit text-sm py-0 px-4',
	xs: 'w-fit text-xs px-3 py-2',
	md: 'w-fit text-sm py-1 px-[1.125rem] min-h-[2.25rem] rounded-lg',
};

type RadioButtonProps = {
	name: string;
	label: string;
	value: string;
	checked: boolean;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	size: RadioButtonSize;
	disabled?: boolean;
	isDivided?: boolean;
};

const radioButtonClassName =
	'inline-flex items-center justify-center cursor-pointer border-y first:rounded-s-sm first:border-l last:rounded-e-sm last:border-r transition duration-150 ease-linear whitespace-nowrap';

const radioButtonDividedClassName =
	'inline-flex items-center justify-center cursor-pointer rounded-sm border border-solid transition duration-150 ease-linear whitespace-nowrap mr-2 mb-4';

const radioButtonColorClassName = 'text-white bg-transparent border-gray-600 hover:bg-gray-600 hover:border-primary'

const radioButtonActiveClassNameByColor = 'bg-gray-600 text-primary border-primary active:text-primary focus:text-primary'

const radioLabelClassName = 'text-sm font-normal text-center whitespace-nowrap';

const radioButtonDisabledClassName = 'bg-opacity-50';

export const RadioButton: FC<RadioButtonProps> = (props) => {
	const {
		name,
		label,
		value,
		checked,
		isDivided,
		size,
		disabled,
		onChange,
	} = props;
	const id = `radio-${value}-${name}`;

	const mergedClassName = clsxMerge(
		isDivided ? radioButtonDividedClassName : radioButtonClassName,
		radioButtonColorClassName,
		classNameBySize[size],
		checked && radioButtonActiveClassNameByColor,
		disabled && radioButtonDisabledClassName,
	);

	return (
		<label htmlFor={id} className={mergedClassName}>
			<span className="relative">
				<input
					type="radio"
					id={id}
					name={name}
					className="hidden"
					value={value}
					checked={checked}
					onChange={onChange}
					disabled={disabled}
				/>
			</span>
			<span className={radioLabelClassName}>{label}</span>
		</label>
	);
};
