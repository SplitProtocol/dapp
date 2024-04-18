import { clsxMerge } from '@/shared/lib/clsxMerge';
import { type InputBaseProps, type InputProps, TextInput } from '@mantine/core';
import type { FC, InputHTMLAttributes, ReactNode } from 'react';

type InputGeneratorSize = 'small' | 'medium' | 'large';

type InputGeneratorProps = InputBaseProps &
	InputProps &
	InputHTMLAttributes<HTMLInputElement> & {
		label?: ReactNode;
		isOptional?: boolean;
		placeholder?: string;
		className?: string;
		isRequired?: boolean;
		sizeInput?: InputGeneratorSize;
	};

const inputWrapperClassName = 'flex flex-col w-full';

const inputClassName =
	'border border-gray-600 bg-gray-500 text-white focus:border-blue disabled:bg-white disabled:opacity-50 autofill:!bg-white autofill:!text-black';

const inputSizeClassName: Record<InputGeneratorSize, string> = {
	small: 'min-h-[1.875rem] rounded-md',
	medium: 'min-h-[2.25rem] rounded-md',
	large: 'min-h-[2.75rem] rounded-lg',
};

export const InputGenerator: FC<InputGeneratorProps> = ({
	isRequired,
	...props
}) => {
	const {
		placeholder,
		value,
		onChange,
		error,
		sizeInput = 'medium',
		type,
		...restProps
	} = props;

	const mergedInputGeneratorClassName = clsxMerge(
		inputClassName,
		inputSizeClassName[sizeInput],
	);

	return (
		<div className={inputWrapperClassName}>
			<TextInput
				{...restProps}
				type={type}
				withAsterisk={isRequired}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				inputWrapperOrder={['label', 'input', 'description', 'error']}
				classNames={{
					root: 'leading-none',
					input: mergedInputGeneratorClassName,
					label: 'text-xs text-left font-semibold whitespace-nowrap font-body mb-1',
					error: 'mt-1',
					description: 'text-black/50',
				}}
				error={error}
			/>
		</div>
	);
};
