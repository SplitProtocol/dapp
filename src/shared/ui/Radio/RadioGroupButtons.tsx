import { type ChangeEvent, type FC } from 'react';

import {
	RadioButton,
	type RadioButtonSize,
} from './RadioButton';

type RadioGroupButtonsProps = {
	name: string;
	items: { label: string; value: string }[];
	value: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	label?: string;
	size: RadioButtonSize;
	disabled?: boolean;
	isDivided?: boolean;
};

const groupWrapperClassName = 'flex flex-col justify-start items-start';

const groupRowClassName = 'flex flex-row items-stretch';

const groupLabelClassName = 'text-sm text-left font-semibold text-black mb-1';

export const RadioGroupButtons: FC<RadioGroupButtonsProps> = (props) => {
	const {
		name,
		items,
		value,
		onChange,
		label,
		size,
		disabled,
		isDivided,
	} = props;

	return (
		<div className={groupWrapperClassName}>
			{label && <div className={groupLabelClassName}>{label}</div>}
			<div className={groupRowClassName}>
				{items.map((item) => (
					<RadioButton
						name={name}
						key={item.value}
						value={item.value}
						label={item.label}
						onChange={onChange}
						size={size}
						checked={value === item.value}
						disabled={disabled}
						isDivided={isDivided}
					/>
				))}
			</div>
		</div>
	);
};
