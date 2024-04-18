import { Button as MantineButton } from '@mantine/core';
import { Link } from 'react-router-dom';
import type {
	ButtonHTMLAttributes,
	FC,
	PropsWithChildren,
	ReactNode,
} from 'react';

import { clsxMerge } from '@/shared/lib/clsxMerge';

type ButtonVariant = 'primary' | 'outline' | 'subtle';
type ButtonSize = 'xs' | 'sm' | 'md' | 'base' | 'lg';
type ButtonColor = 'base' | 'blue' | 'gray' | 'red';

const variantClassName: Record<
	ButtonVariant,
	{
		base: string | string[];
	} & Partial<Record<ButtonColor, string[]>>
> = {
	primary: {
		base: [
			'bg-primary md:hover:bg-primary/80 text-black hover:text-black border-primary hover:border-primary/80 hover:bg-primary/80',
		],
		blue: [
			'bg-blue',
			'md:hover:bg-blue-600',
			'active:bg-blue-600',
			'border-blue',
			'hover:border-blue-600',
		],
		red: [
			'bg-red-500 md:hover:bg-red-700 active:bg-red-700 border-red-500 hover:border-red-700',
		],
		gray: [
			'bg-gray-300/50 md:hover:bg-gray-300/80 active:bg-gray-400 border-gray-300/50 hover:border-gray-300/80 text-gray-600',
		],
	},
	subtle: {
		base: [
			'bg-transparent border-none text-pink hover:bg-pink/10 hover:text-pink',
		],
		blue: [
			'bg-transparent border-none text-blue hover:bg-blue/10 hover:text-blue',
		],
	},
	outline: {
		base: [
			'bg-transparent border text-white border-solid border-primary',
			'hover:text-white hover:bg-primary/80 hover:border-primary/80',
		],
		red: [
			'bg-transparent border border-solid border-red',
			'hover:text-white hover:bg-red',
		],
		blue: [
			'bg-transparent border border-solid text-blue border-blue',
			'hover:bg-blue hover:border-blue',
			'hover:text-white',
			'active:bg-blue active:text-white',
		],
		gray: [
			'bg-transparent border border-solid text-gray border-gray-300',
			'hover:bg-gray-300 hover:border-gray-300',
			'active:bg-gray-400 active:text-gray-800',
		],
	},
};

const classNameBySize: Record<ButtonSize, string> = {
	base: 'w-fit h-[2.25rem] px-4 py-2 text-sm rounded-lg font-semibold font-body',
	sm: 'w-fit h-[1.75rem] text-xs py-0 px-2 rounded-md font-semibold font-body',
	md: 'w-fit h-[2.125rem] text-sm px-4 py-2 rounded-lg font-bold font-body',
	xs: 'w-fit text-xs px-3 py-2 rounded-lg font-semibold font-body',
	lg: 'w-fit text-md px-6 py-2 rounded-lg font-semibold font-body h-[3.375rem] min-w-[15rem]',
};

const buttonClassName =
	'flex justify-center font-body items-center text-center whitespace-nowrap transition-all gap-x-2';

const fullWidthClassName = 'w-full';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
	ariaLabel?: string;
	className?: string;
	color?: ButtonColor;
	size?: ButtonSize;
	variant?: ButtonVariant;
	onClick?: () => void;
	isLinkButton?: boolean;
	linkTo?: string;
	fullWidth?: boolean;
	rightIcon?: ReactNode;
	leftIcon?: ReactNode;
	disabled?: boolean;
};

export const Button: FC<PropsWithChildren<unknown> & Props> = ({
	children,
	...props
}) => {
	const {
		type,
		ariaLabel,
		variant = 'primary',
		size = 'sm',
		color = 'base',
		onClick,
		className,
		isLinkButton,
		linkTo,
		fullWidth,
		rightIcon,
		leftIcon,
		disabled,
	} = props;

	const { base: variantBaseClassName, [color]: variantColorClassName } =
		variantClassName[variant];

	const mergedClassName = clsxMerge(
		variantBaseClassName,
		variantColorClassName,
		classNameBySize[size],
		buttonClassName,
		fullWidth && fullWidthClassName,
		className,
		disabled && 'opacity-30 text-white/90 cursor-not-allowed',
	);

	if (isLinkButton && linkTo) {
		return (
			<Link
				aria-label={ariaLabel}
				color={color}
				className={mergedClassName}
				to={linkTo}
			>
				{leftIcon && (
					<div className="flex justify-center items-center">
						{leftIcon}
					</div>
				)}
				{children}
			</Link>
		);
	}

	return (
		<MantineButton
			type={type}
			aria-label={ariaLabel}
			variant={variant}
			size={size}
			color={color}
			onClick={onClick}
			className={mergedClassName}
			leftSection={leftIcon}
			rightSection={rightIcon}
			disabled={disabled}
			classNames={{
				section: 'mr',
			}}
		>
			{children}
		</MantineButton>
	);
};
